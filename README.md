# Blabrm0uth


##### Blabrm0uth is a web application that generates captions, summaries, and answers questions about YouTube videos using a Django backend and a React frontend.


## Features


##### Generate full captions for a YouTube video
##### Generate a summary of a YouTube video
##### Ask a question about a YouTube video and get an answer


## Usage


##### Enter a YouTube video link in the input field.
##### Select the desired action: Captions, Summary, or Question.
##### If Summary is selected, enter the desired summary size.
##### If Question is selected, type your question about the video.
##### Click "Submit" to generate the captions, summary, or answer.
##### After the result is displayed, use the "Done", "Regenerate", or "Edit" buttons to navigate between different states.


## Tech Stack


##### Backend: Django
##### Frontend: React
##### CSS: Custom CSS


## Setup


### Prerequisites


##### Python 3.8 or higher
##### Node.js 14 or higher
##### npm 6 or higher
##### openAI API KEY


### Installation


#### Clone the repository:

##### git clone https://github.com/Torious/Blabrm0uth.git

#### Change into the project directory:

##### cd backend/blabrm0uth

#### Create a Python virtual environment and activate it:

##### python -m venv venv
##### source venv/bin/activate (Linux/Mac)
##### venv\Scripts\activate (Windows)

#### Install the backend dependencies:

##### pip install -r requirements.txt

#### Create your .env file inside the backend/blabrm0uth directory and setup your openAI API KEY:

##### API_KEY = your_api_key

#### Start the Django backend server:

##### python manage.py runserver

#### Open a new terminal and change into the frontend directory:

##### cd frontend/blabrm0uth

#### Install the frontend dependencies:

##### npm install

#### Start the React development server:

##### npm start

#### The application should now be running at http://localhost:3000/.

##### If you want to contribute to this project, please create a fork of the repository and submit a pull request.

### License


##### This project is licensed under the MIT License.


