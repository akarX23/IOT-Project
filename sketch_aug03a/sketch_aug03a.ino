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

int thermoDO3 = 13;
int thermoCS3 = 0;
int thermoCLK3 = 15;

MAX6675 thermocouple1(thermoCLK1, thermoCS1, thermoDO1);
MAX6675 thermocouple2(thermoCLK2, thermoCS2, thermoDO2);
MAX6675 thermocouple3(thermoCLK3, thermoCS3, thermoDO3);

// WIFI CREDENTIALS
const char* ssid = "midlf";
const char* password = "maachuda";

//Domain name with URL path or IP address with path
const char* serverName = "http://43.205.129.158/api/calculate";

// Variable to make sure value is calculated only once
bool calculated = false;

// ALL CONSTANT VALUES FOR CALCULATION
float voltage = 60;
float current = 0.5;
float atmTemp = 30;
float diameter = 0.0127;
float lengthForCalc = 0.15;

void setup() {
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());
 
  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");
}

void loop() {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED && !calculated){

      // Get temperatures
      float t1 = thermocouple1.readCelsius();
      float t2 = thermocouple2.readCelsius();
      float t3 = thermocouple3.readCelsius();
      
      WiFiClient client;
      HTTPClient http;
      
      // Your Domain name with URL path or IP address with path
      http.begin(client, serverName);

      // Specify content-type header
      http.addHeader("Content-Type", "application/json");
      
      // Data to send with HTTP POST
      String httpRequestData = String("{\"voltage\":") + voltage + String(",\"current\":") + current + String(",\"temperatures\":") + String("[") + t1 + String(",") + t2 + String(",") + t3 + String("]") + String(",\"atmTemp\":") + atmTemp + String(",\"diameter\":") + diameter + String(",\"length\":") + lengthForCalc + String("}");           

      // Send HTTP POST request
      int httpResponseCode = http.POST(httpRequestData);
     
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.println("HTTP Response: ");
      Serial.println(http.getString());
        
      // Free resources
      http.end();

      calculated = true;
    }
    else {
      Serial.println("WiFi Disconnected");
    }

    delay(2000);
}
