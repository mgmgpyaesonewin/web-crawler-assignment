# Web Crawler Challenge

Develop a web application that scrapes Google search results for large-scale keyword analysis, bypassing Google's restrictions on mass searches. The application should store the scraped data and provide authenticated users with the ability to view and receive reports on this data. Third-party APIs for obtaining Google search data are not allowed.

### Prerequisites

# Homebrew
- Homebrew is a package manager for macOS that will help you install the other required tools easily.
- Install Homebrew by running the following command in your terminal:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

# PHP and Composer
- Laravel is a PHP framework, so you need to have PHP installed on your system.
- Install PHP using Homebrew:
```bash
brew install php
```
- Composer is a dependency manager for PHP, used to install Laravel and other PHP packages.
- Install Composer by running the following commands:
```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php composer-setup.php
php -r "unlink('composer-setup.php');"
mv composer.phar /usr/local/bin/composer
```

# Node.js & npm
- Node.js is a JavaScript runtime required to run JavaScript code outside of a browser, and npm is the package manager for Node.js.
- Install Node.js and npm using Homebrew:
```bash
brew install node
```  
# PostgreSQL
- PostgreSQL is the database system that you'll be using.
- Install PostgreSQL using Homebrew:
```bash
brew install postgresql
```

### Getting Start

# Setting Up
- Clone the repository
```bash
git clone git@github.com:mgmgpyaesonewin/web-crawler-assignment.git
```
- go to laravel dir
```bash
cd application-api
```
- install composer
```bash
composer install
```
- copy .env.example
```bash
cp .env.example .env
php artisan key:generate
```
- Update the following config
```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=<your_db>
DB_USERNAME=<username>
DB_PASSWORD=<password>

FRONTEND_URL=http://localhost:3000
AWS_ACCESS_KEY_ID=XXXXXXXXXXX (included in email for testing purpose)
AWS_SECRET_ACCESS_KEY=XXXXXXXX
SQS_PREFIX=https://sqs.ap-southeast-1.amazonaws.com/XXXXXXXXX/XXXXXXXXXX
AWS_DEFAULT_REGION=ap-southeast-1
```
- run migration
```
php artisan migrate
```

- Go to application frontend
```
cd application-frontend
npm install     
cp .env.example .env
```
- update the following .env
```
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000
```

- Go to Spider
```
cd spider-api
cp .env .env.example
```

Update the following config
```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-southeast-1
AWS_SQS_URL=
CALLBACK_API_URL=http://127.0.0.1:8000/api/spider-callback
```

Run Node.js
```
node app.js
```

# Testing Result

## Backend Test
<img width="1792" alt="Screen Shot 2024-03-13 at 2 18 46 PM" src="https://github.com/mgmgpyaesonewin/web-crawler-assignment/assets/12793202/f7f9146a-b80d-4e5b-8873-51dcc0f69ff5">

## Frontend Test
<img width="1792" alt="Screen Shot 2024-03-13 at 2 19 20 PM" src="https://github.com/mgmgpyaesonewin/web-crawler-assignment/assets/12793202/0da92070-1c1c-46f5-a6d0-2c3654965f22">

# Architecture Desgin

```
@startuml
!theme bluegray
skinparam Style strictuml
skinparam SequenceMessageAlignment center
autonumber

actor User
participant Frontend as FE
participant Backend as BE
participant "AWS SQS" as SQS
participant "Crawler Service" as CM
participant "Puppeteer Headless Browser Cluster" as PB
participant "Puppeteer Cluster Queue" as PCQ

User -> FE: Upload CSV file
FE -> BE: Parse CSV and send keywords as string
BE -> SQS: Send keywords
SQS -> CM: Receive message
CM -> PCQ: Push keywords
PCQ -> PB: Start crawling
PB -> PCQ: Send callback with results
PCQ -> BE: Send results
BE -> FE: Send results to display

@enduml
```

![image](https://github.com/mgmgpyaesonewin/web-crawler-assignment/assets/12793202/42089f7a-431d-48ed-8a95-98877e3d1e79)

The Thing Architecture in this context refers to a system designed for web crawling using a combination of front-end and back-end services, AWS SQS, a Crawler Service, and Puppeteer running in cluster mode. The architecture is designed to enhance the user experience by allowing multiple users to asynchronously add multiple keywords for web crawling.

- User Interaction:
  - Users interact with the system by uploading CSV files containing keywords to the front-end (FE) service.
  - The FE parses the CSV file and sends the extracted keywords as a string to the back-end (BE).

- Backend Processing:
  - The BE receives the keywords and forwards them to AWS SQS, which acts as a message queue.
  - The Crawler Service (CM) listens to the SQS queue and retrieves the keywords for processing.

- Asynchronous Keyword Addition:
  - The system is designed to handle multiple users simultaneously, allowing them to add keywords asynchronously.
  - This is achieved through the use of the SQS queue, which decouples the BE from the CM, enabling scalable and non-blocking keyword addition.

- Puppeteer Cluster Mode:
  - The CM pushes the keywords to the Puppeteer Cluster Queue (PCQ), which manages the distribution of crawling tasks across a cluster of Puppeteer instances.
  - Puppeteer is running in cluster mode, which means it can spawn multiple headless browser instances in parallel, significantly improving crawling efficiency and speed.
  - The cluster mode also provides fault tolerance and load balancing, ensuring that the crawling process is resilient and can handle a large volume of keywords.

- Results Callback:
  - Once the crawling is complete, the PCQ sends a callback with the results to the BE.
  - The BE then forwards these results to the FE, where they are displayed to the user.




