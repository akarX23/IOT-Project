#include <max6675.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// TEMPERATURE SENSOR PINS
int thermoDO1 = 16;
int thermoCS1 = 5;
int thermoCLK1 = 4;

int thermoDO2 = 2;
int thermoCS2 = 12;
int thermoCLK2 = 14;

//int thermoDO3 = 13;
//int thermoCS3 = 0;
//int thermoCLK3 = 15;
const int pushbutton = 13; //13
int buttonState = 0;  //0
//int thermoCLK3 = 4; //15

MAX6675 thermocouple1(thermoCLK1, thermoCS1, thermoDO1);
MAX6675 thermocouple2(thermoCLK2, thermoCS2, thermoDO2);
//MAX6675 thermocouple3(thermoCLK3, thermoCS3, thermoDO3);

// WIFI CREDENTIALS
const char* ssid = "";
const char* password = "";

//Domain name with URL path or IP address with path
const char* serverName = "http://43.205.129.158/api/initialize";

void connectToWifi() {
  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
}

void dataToServer() {
  // Get temperatures
  float t1 = thermocouple1.readCelsius();
  float t2 = thermocouple2.readCelsius();
  //float t3 = thermocouple2.readCelsius();

  WiFiClient client;
  HTTPClient http;

  // Your Domain name with URL path or IP address with path
  http.begin(client, serverName);

  // Specify content-type header
  http.addHeader("Content-Type", "application/json");

  // Data to send with HTTP POST
  String httpRequestData = String("{\"temperatures\":") + String("[") + t1 + String(",") + t2 + String("]}");

  // Send HTTP POST request
  int httpResponseCode = http.POST(httpRequestData);

  Serial.print("HTTP Response code: ");
  Serial.println(httpResponseCode);
  Serial.println("HTTP Response: ");
  Serial.println(http.getString());

  // Free resources
  http.end();
}

void setup() {
  Serial.begin(115200);
  connectToWifi();
}

void loop() {
  if (WiFi.status() == WL_CONNECTED ) {
    buttonState = digitalRead(pushbutton);

    //Serial.println(buttonState);
    if (buttonState == HIGH) {
      dataToServer();
      delay(2000);
    }
  } else {
    // attempt to connect every 10 seconds
    Serial.println("WIFI Disconnected ");
    connectToWifi();
    delay(10000);
  }
}
