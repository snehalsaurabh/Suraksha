Download the weights 'best.pt' from the following link: https://drive.google.com/drive/folders/1VL3vKJF8Z77deqPKGr3ocCZ2DnBrKR0P?usp=drive_link

Paste 'best.pt' into the following location: yolov9/runs/train/exp3/weights/best.pt

How to run the model.

1. Make a virtual environment.
```bash
python -m venv venv
```
2. Activate the virtual environment.
```bash
.\venv\Scripts\activate
```
3. Install the requirements. Come back to the main directory and run the following command.
```bash
pip install -r requirements.txt
```
4. Run the model using the given below commands.

## Best way to run the model
a. You can use postman now with the recent changes made to testserver2.py. You can run the following command to start the server.
```bash
uvicorn testserver2:app --reload
```
to run server.

Most likely, it will be working on http://127.0.0.1:8000/upload/

b. Now, open postman and send a POST request to the above address with the image as a form-data in the body section. The key should be 'file' and the value should be the image. The image should be in the assets folder. You can use crash.jpeg as an example.

c. You will get the respone in the form of JSON. The JSON will contain the class of the object detected and the confidence of the detection.

Please note that if it is not working, you will have to fix the path of the python.exe file in the code of custom_auto and automate.py. It is hard coded to my virtual environment currently. Set it to your virtual environment in the same way that I have done.

## Way 1

Run this command:
```bash
cd yolov9
python findclass.py --imgsz 1280 --conf-thres 0.1 --device cpu --weights runs\\train\\exp3\\weights\\best.pt --source ..\\assets\\crash.jpeg
```

You can use any image. Crash.jpeg is just an example.

NOTE: If Way 2 and Way 3 are not working for you, in the code of custom_auto and automate.py, change the path of the python.exe file in the first line of the code to the path of the python.exe file in your virtual environment. It is hard coded to my virtual environment currently. 

## Way 2

You can run automate.py to run the above command automatically. Just run the following command:
```bash
python automate.py
```
simply change the address of the image in the automate.py file.

## Way 3

You can run the following command to run the above command automatically:
```bash
python custom_auto.py "path_to_image"
```
you don't have to put the image path in the automate.py file. Just pass it as an argument. Don't forget to put the image in the assets folder. Use quotes if the path has spaces.
