import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
import io
import base64
import math

# Load the model once to avoid reloading it for each prediction
MODEL_PATH = "logisticmodel5.tflite"
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# Class labels mapping
CLASS_LABELS = {
    0: "Damaged Card Box",
    1: "Card Box",
    2: "Damaged Envelope",
    3: "Envelope",
    4: "Damaged IBC",
    5: "IBC",
    6: "Damaged Pallet",
    7: "Pallet",
    8: "Damaged Plastic Bag",
    9: "Plastic Bag",
    10: "Damaged Wooden Crate",
    11: "Wooden Crate"
}

def data_uri_to_image(data_uri):
    """Convert a base64 data URI to a PIL image."""
    # Remove the header part (data:image/jpeg;base64,...)
    image_data = base64.b64decode(data_uri.split(',')[1])
    image = Image.open(io.BytesIO(image_data))
    return image

def predict(data_uri):
    """Preprocess the image and make a prediction from the base64 data URI."""
    img = data_uri_to_image(data_uri).convert("RGB")
    img = img.resize((244, 244))  # Resize to match model input size

    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # Convert to float32 (ensure type matches model input)
    img_array = img_array.astype(np.float32)

    # Run inference
    interpreter.set_tensor(input_details[0]['index'], img_array)
    interpreter.invoke()
    predictions = interpreter.get_tensor(output_details[0]['index'])

    # Process prediction
    predicted_class = np.argmax(predictions)
    confidence = predictions[0][predicted_class]

    return predicted_class, confidence


def check_text(pred_index, confidence):
    """Convert prediction index to readable label."""
    if 0.35 <= confidence < 0.5:
        pred_text = "I have doubt, Sorry!"
    elif confidence < 0.4:
        pred_text = "I don't know"
    else:
        pred_text = CLASS_LABELS.get(pred_index, "Unknown")

    return pred_text


def scan(img_path):
    """External function to predict an image classification."""
    pred_result, confidence = predict(img_path)
    pred_text = check_text(pred_result, confidence)
    confidence = math.floor(float(confidence) * 100) / 100 
    pred_result = float(pred_result)
    return {"prediction": pred_text, "confidence": confidence, "index": pred_result}






