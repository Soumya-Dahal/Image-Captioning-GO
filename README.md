# IMAGE CAPTIONING USING VIT-ENCODER AND GPT2 DECODER
## 1. Clone this repository.
## 2. Change directory using (cd ~/Image-Captioning-GO)
## 4. Run 'pip install -r requirements.txt'
## 5. Go to the 'caption-app' directory and run npm install and npm run start(if this throws error, try installing react-scripts directly:
## 'npm install react-scripts --save-dev' and 'npm run start'). A react app will run on port 3000 and open in default browser, allow camera access.
## 6. Go to the project root directory and run 'go run main.go'. A back-end service will run.
## 7. Staying in the root directory run source venv/bin/activate then again run  'python3 app.py'. A python app for image captioning will run.(run pip install -r requirements.txt to install python dependencies)
## 8. Your browser now produces caption for images captured using webcam.

##ARCHITECTURE
┌─────────────────────────────────────────────────────────────┐
│                    Client (Frontend/Browser)                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ REST API (localhost:8080)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Go Service (Gateway)                     │
│  • CORS handling                                            │
│  • Rate limiting                                            │
│  • Request validation                                       │
│  • Load balancing                                           │
│  • Circuit breaking                                         | 
│  • Acts as reverse proxy to python service   
|  • json validation
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ Internal REST (localhost:8000)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│              Python/FastAPI (Model Service)                 │
│  • Model loading/inference                                  │
│  • GPU management                                           │
│  • Model-specific validation                                │
│  • Automatic API docs                                       │
└─────────────────────────────────────────────────────────────┘
