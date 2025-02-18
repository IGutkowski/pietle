# Piechartle 🎯  

Piechartle is a web-based guessing game where players estimate the percentage of a highlighted cyan segment in a pie chart within five attempts. A new challenge is generated daily, making it an engaging and fun puzzle experience.  

## 🚀 Live Demo  
Play the game here: [Piechartle](https://www.piechartle.com)  

## 🛠️ Tech Stack  
- **Frontend:** ReactJS  
- **Hosting:** Vercel  
- **Chart Rendering:** D3.js  
- **State Management:** LocalStorage  
- **SEO & Accessibility:** Helmet, ARIA attributes  
- **Monetization:** Google AdSense  

## 🎮 How to Play  
1. Look at the pie chart and estimate the percentage of the cyan area.  
2. Enter your guess (0-100) and submit.  
3. You have **5 attempts** to get it right.  
4. If incorrect, you'll receive feedback on whether the correct percentage is higher or lower.  
5. A new challenge appears **every day at midnight UTC**.  

## 📦 Features  
- **Daily challenge** with a new randomly generated percentage.  
- **Responsive design**, working seamlessly on all devices.  
- **Accessible UI**, supporting keyboard navigation and ARIA attributes.  
- **SEO optimized** with structured metadata for better discoverability.  
- **Game state persistence** using LocalStorage, so guesses remain saved.  
- **D3.js integration** for dynamic pie chart rendering.  

## 🖥️ Local Development  
To run Piechartle locally:  
```bash
git clone https://github.com/IGutkowski/pietle.git
cd pietle
npm install
npm run dev
