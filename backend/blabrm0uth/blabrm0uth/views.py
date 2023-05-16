# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from youtube_transcript_api import YouTubeTranscriptApi
import re
import requests
import os
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from decouple import config
from django.http import HttpResponse
from django.template import loader

def index(request):
    template = loader.get_template('index.html')
    return HttpResponse(template.render({}, request))
    
class CaptionAPIView(APIView):
    def post(self, request, *args, **kwargs):
        video_link = request.data.get('video_link')
        if video_link:
            captions_string = get_captions_from_video_link(video_link)
            if captions_string:
                return Response({"captions": captions_string}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Failed to fetch closed captions."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Video link is required."}, status=status.HTTP_400_BAD_REQUEST)

class SummarizeAPIView(APIView):
    def post(self, request):
        video_link = request.data.get('video_link')
        words = request.data.get('words')

        if video_link:
            captions_string = get_captions_from_video_link(video_link)
            if captions_string:
                prompt = "Summarize the following youtube video using its captions in " + words + " words: " + captions_string

            try:
                generated_text = call_chatgpt(prompt)
                return Response({"generated_text": generated_text})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({"error": "Failed to fetch closed captions."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Video link is required."}, status=status.HTTP_400_BAD_REQUEST)

class QuestionAPIView(APIView):
    def post(self, request):
        video_link = request.data.get('video_link')
        question = request.data.get('question')

        if video_link:
            captions_string = get_captions_from_video_link(video_link)
            if captions_string:
                prompt = "do your best to answer the following question by referring to the captions of the youtube video provided: Question:" + question + " Captions: " + captions_string

            try:
                generated_text = call_chatgpt(prompt)
                return Response({"generated_text": generated_text})
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                return Response({"error": "Failed to fetch closed captions."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Video link is required."}, status=status.HTTP_400_BAD_REQUEST)
        

def get_video_id(video_link):
    pattern = r"(?:http(?:s)?://)?(?:www\.)?(?:youtube\.com/|youtu\.be/)(?:(?:watch\?v=)?|v/)?([-0-9a-zA-Z_]{11})"
    match = re.match(pattern, video_link)
    if match:
        return match.group(1)
    raise ValueError("Invalid YouTube video link.")

def fetch_closed_captions(video_id, language="en"):
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
        return transcript
    except Exception as e:
        print("Error:", e)
        return None

def captions_to_string(captions):
    caption_text = " ".join(caption["text"] for caption in captions)
    return caption_text

def get_captions_from_video_link(video_link):
    video_id = get_video_id(video_link)
    captions = fetch_closed_captions(video_id)
    if captions:
        captions_string = captions_to_string(captions)
        return captions_string
    else:
        return None

def call_chatgpt(prompt):
    API_KEY = config('API_KEY')
    url = "https://api.openai.com/v1/chat/completions"

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {API_KEY}",
    }

    data = {
    'model': 'gpt-3.5-turbo',
    'messages': [
            {
                'role': 'user',
                'content': prompt
            }
        ]
    }

    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        response_data = response.json()
        generated_text = response.json()['choices'][0]['message']['content']
        return generated_text
    except requests.exceptions.RequestException as e:
        raise Exception(f"Error calling ChatGPT API: {str(e)}")
