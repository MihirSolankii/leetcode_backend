import sys
import json  # Import json to format the output
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

def setup_driver():
    """Set up the Chrome WebDriver."""
    chrome_options = Options()
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    # Uncomment the next line to run Chrome in headless mode
    # chrome_options.add_argument("--headless")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    return driver

def close_popup(driver):
    """Attempt to close the popup if it appears."""
    try:
        close_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "button[aria-label='Close']"))
        )
        close_button.click()
    except TimeoutException:
        pass 

def scrape_leetcode_problem(url):
    """Scrape details from a LeetCode problem page."""
    driver = setup_driver()
    response_data = {}

    try:
        driver.get(url)
        close_popup(driver)

        title = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.text-title-large a"))
        ).text
        
        difficulty = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".text-difficulty-hard, .text-difficulty-medium, .text-difficulty-easy"))
        ).text
        
        description = WebDriverWait(driver, 30).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "div.elfjS"))
        ).text
        
        try:
            topics_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "div.group.flex.cursor-pointer"))
            )
            driver.execute_script("arguments[0].click();", topics_button)
        except TimeoutException:
            response_data["topics"] = []

        try:
            WebDriverWait(driver, 10).until(
                EC.visibility_of_all_elements_located((By.CSS_SELECTOR, "div.mt-2.flex.flex-wrap.gap-1 a"))
            )
        except TimeoutException:
            response_data["topics"] = []

        topics_elements = driver.find_elements(By.CSS_SELECTOR, "div.mt-2.flex.flex-wrap.gap-1 a")
        topics = [topic.text for topic in topics_elements]

        # Prepare the data to send back to Node.js
        response_data = {
            "title": title,
            "difficulty": difficulty,
            "description": description,
            "topics": topics
        }

    except Exception as e:
        response_data = {"error": str(e)}  # Store error in the response

    finally:
        driver.quit()
        print(json.dumps(response_data))  # Print the response as JSON

if __name__ == "__main__":
    # Get the URL from command-line arguments
    if len(sys.argv) != 2:
        print(json.dumps({"error": "URL is required."}))  # Error if no URL is provided
        sys.exit(1)

    url = sys.argv[1]  # The URL is passed as an argument
    scrape_leetcode_problem(url)
