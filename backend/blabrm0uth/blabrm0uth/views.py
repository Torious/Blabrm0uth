# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from youtube_transcript_api import YouTubeTranscriptApi
import re

# Copy the get_captions_from_video_link function and its dependencies here

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