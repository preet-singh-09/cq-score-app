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

While LangChain is a powerful tool for building applications around language models, \
it introduces additional complexity and dependencies that may not be necessary for simpler use cases. 

The ChatGPT API offers a more straightforward and efficient solution, especially in cases where we need to \
quickly integrate language processing into our applications without managing intricate frameworks.

For a Production use case, AI tools are available that integrate directly with the CI/CD pipeline to perform the code analysis.




