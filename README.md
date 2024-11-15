## Code Quality Score Web Application

Steps to get the project up and running

1. Place the .env file in the in the root directory containing the following environment variables 
    * OPENAI_API_KEY
    * OPENAI_ORG_ID
    * OPENAI_PROJECT_ID

2. in the project root directory execute the following command to install all the dependencies
    * npm install

3. Run the development server by executing the following command
    * npm run dev

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## LangChain

LangChain is beneficial when there is a requirement for building a custom AI implementation for reviewing source code.\

For simplicity, OpenAI API client is used to review the source code and provide an overall Code Quality Score for a file fetched from GitHub repository.\

For a Production use case, AI tools are available that integrate directly with the CI/CD pipeline to perform the code analysis.




