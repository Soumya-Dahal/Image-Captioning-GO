Image Captioning Using ViT Encoder and GPT-2 Decoder

This project implements an end-to-end image captioning system using a Vision Transformer (ViT) as the image encoder and GPT-2 as the text decoder.

The system consists of a React frontend, a Go backend API, and a Python-based machine learning service. Users can capture images using a webcam and receive automatically generated captions in real time.

Project Architecture

Frontend: React application (webcam capture and UI)

Backend API: Go service (request handling and orchestration)

ML Service: Python application (ViT + GPT-2 inference)

Prerequisites

Ensure the following are installed on your system:

Python 3.8+

Go 1.18+

Node.js (LTS recommended)

npm

pip

Virtual environment support (venv)

Installation & Setup
1. Clone the Repository
git clone <repository-url>
cd Image-Captioning-GO

2. Set Up Python Virtual Environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

3. Set Up the Frontend (React App)
cd caption-app
npm install
npm run start


If react-scripts causes issues:

npm install react-scripts --save-dev
npm run start


The frontend runs at http://localhost:3000
.
Allow camera access when prompted.

4. Run the Go Backend API
cd ..
go run main.go

5. Run the Python Image Captioning Service
source venv/bin/activate
python3 app.py

Run Everything Automatically
./start.sh

Important Note

Before running ./start.sh:

The Python virtual environment (venv) must exist

Python dependencies must be installed inside the virtual environment

source venv/bin/activate
pip install -r requirements.txt


The script assumes all dependencies are already installed and does not install them automatically.

Usage

Open the React web application.

Allow webcam access.

Capture an image.

View the generated caption.

Notes

All services must run simultaneously.

First inference may take longer due to model initialization.

GPU acceleration improves performance if available.
