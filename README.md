# ✈️ Flight Finder Project

A Python-based flight deal tracker that fetches low-cost flights using the Tequila (Kiwi) API and sends alerts via WhatsApp or SMS using Twilio when prices fall below your target. All destination and price tracking is managed via a Google Sheet.

---

## 🧠 Features

- Track flight deals based on custom price limits
- Automatically fetch IATA codes if missing
- Integrate with Google Sheets using Sheety API
- Sends notifications via WhatsApp/SMS using Twilio
- Daily flight search from origin to destination cities

---

## 📁 Project Structure

```text
Flight-finders-project/
│
├── main.py                   # Main execution script
├── data_manager.py           # Handles Google Sheet data via Sheety API
├── flight_data.py            # FlightData class to store flight details
├── flight_search.py          # Interacts with Tequila API to find flights
├── notification_manager.py   # Sends notifications using Twilio
├── .env                      # Contains your API keys and credentials
└── requirements.txt          # Python dependencies (optional)
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/nazeer-ahmad-web/Flight-finders-project.git
cd Flight-finders-project
```

### 2. Create and activate a virtual environment

```bash
python -m venv venv
venv\Scripts\activate  # For Windows
# or
source venv/bin/activate  # For macOS/Linux
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

<sub>If `requirements.txt` is missing, install manually:</sub>

```bash
pip install python-dotenv requests python-dateutil
```

---

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
TEQUILA_API_KEY=your_tequila_api_key
SHEETY_ENDPOINT=https://api.sheety.co/your_project/flightDeals/prices
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_PHONE=whatsapp:+14155238886
TWILIO_TO_PHONE=whatsapp:+91xxxxxxxxxx
```

---

## 🚀 Run the App

```bash
python main.py
```

- Fetches destination data from your Google Sheet
- Adds missing IATA codes if needed
- Searches for flight deals
- Sends WhatsApp/SMS notification if a good deal is found
- Updates the sheet with the lowest prices found

---

## 🛠️ Tech Stack

- Python 3.x
- Tequila (Kiwi) API – for flight data
- Sheety – for reading/writing to Google Sheets
- Twilio – for sending notifications
- dotenv – to securely manage credentials

---

## 📚 References

- 100 Days of Code: Python Bootcamp by Dr. Angela Yu
- [Tequila API Docs](https://tequila.kiwi.com/portal/docs/tequila_api)
- [Sheety API](https://sheety.co/docs)
- [Twilio WhatsApp API](https://www.twilio.com/docs/whatsapp)

---

## 🤝 Contributing

1. Fork this repo
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature-name`)
5. Create a Pull Request

---

## 📄 License

MIT License

---

## 📬 Contact

For questions or feedback, reach out to [nazeer-ahmad-web](https://github.com/nazeer-ahmad-web)

---


