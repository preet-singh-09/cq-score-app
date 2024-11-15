'use client';
import { FormEvent } from "react";
import { useState } from "react";
import Markdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Image from 'next/image'

export default function Home() {

  const [activeTab, setActiveTab] = useState('githubDetails');

  const [resultsActiveTab, setResultsActiveTab] = useState('codeQualityReview');

  const [githubURL, setGithubURL] = useState('');
  const [fileSHA, setFileSHA] = useState('');

  const [processing, setProcessing] = useState(false);
  const [resultsLoaded, setResultsLoaded] = useState(false);
  const [resultsError, setResultsError] = useState(false);
  const [score, setScore] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [fileContent, setFileContent] = useState('');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [history, setHistory] = useState<any[]>([]);

  const [validationError, setValidationError] = useState('');

  async function clearForm() {
    setGithubURL('');
    setFileSHA('');
    setValidationError('');
    setProcessing(false);
    setResultsLoaded(false);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function checkAgain(historyItem: any) {

    Promise.all([
      setGithubURL(historyItem.githubURL),
      setFileSHA(historyItem.fileSHA)
    ]).then(() => {

      setActiveTab('githubDetails');

      setTimeout(() => {
        onSubmit(null);
      }, 500);
    });
  }

  async function onSubmit(event: FormEvent<HTMLFormElement> | null) {
    if (event) {
      event.preventDefault();
    }
    if (processing) {
      return;
    }

    if (githubURL.trim() == '') {
      setValidationError('Github Repository URL cannot be blank');
      return;
    }
    if (githubURL.indexOf('github.com') < 0
      || githubURL.split('/').length < 5
    ) {
      setValidationError('Github Repository URL is not valid');
      return;
    }
    if (fileSHA.trim() == ''
      || fileSHA.trim().length < 40
    ) {
      setValidationError('File SHA Hash must be a 40 characters string');
      return;
    }

    setValidationError('');
    setResultsError(false);
    setResultsLoaded(false);
    setProcessing(true);
    setExplanation('');

    if (history.length > 0) {
      if (history[history.length - 1].fileSHA == fileSHA && history[history.length - 1].githubURL == githubURL) {
        // do not push in history as it is the same entry as last one
      } else {
        setHistory([...history, { githubURL, fileSHA }]);
      }
    } else {
      setHistory([...history, { githubURL, fileSHA }]);
    }

    try {
      const response3 = await fetch('api/score-api', {
        body: JSON.stringify({ githubURL, fileSHA }),
        method: 'POST',
      });

      const outputJSON = await response3.json();

      const scoreJSON = JSON.parse(outputJSON.message.content.replace('```json', '').replace('```', ''));

      setScore(scoreJSON.score);
      setExplanation(scoreJSON.explanation);
      setFileContent(atob(outputJSON.fileContent))
      setResultsLoaded(true);
    } catch (err) {
      console.error('Could not fetch results', err);
      setResultsLoaded(false);
      setResultsError(true);
    }

    setProcessing(false);
  }

  // Handle response if necessary
  // const data = await response.json();
  // ...


  return (
    <div className="p-10 font-[family-name:var(--font-geist-sans)] h-screen">
      <main className="flex flex-col gap-0 row-start-2 items-start h-full">
        <div className="bg-white">
          <nav className="flex flex-col sm:flex-row">
            <button className={"py-4 px-6 block  focus:outline-none border-b-2 font-medium  " + (activeTab == 'githubDetails' ? 'hover:text-blue-500 text-blue-500 border-blue-500' : 'text-gray-600 border-transparent')}
              onClick={() => { setActiveTab('githubDetails') }}>
              Github Repository Details
            </button>
            <button className={"py-4 px-6 block  focus:outline-none border-b-2 font-medium  " + (activeTab == 'history' ? 'hover:text-blue-500 text-blue-500 border-blue-500' : 'text-gray-600 border-transparent')}
              onClick={() => { setActiveTab('history') }}>
              History
            </button>
          </nav>
        </div>
        <div className="border border-gray-200 shadow rounded-sm p-5 w-full">
          {activeTab == 'githubDetails' && <form onSubmit={onSubmit}>
            <div className="">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base/7 font-semibold text-gray-900"></h2>
                <p className="mt-1 text-sm/6 text-gray-600">Please enter the URL of the GitHub repository.</p>

                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-4">
                    <label htmlFor="github_url" className="block text-sm/6 font-medium text-gray-900">GitHub Repository URL</label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-[90vw]">
                        <input type="text"
                          value={githubURL}
                          onChange={(event) => {
                            setGithubURL(event.target.value);
                          }}
                          name="github_url" id="github_url" autoComplete="github_url" className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6 " placeholder="https://github.com/" />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <label htmlFor="github_url_file_sha" className="block text-sm/6 font-medium text-gray-900">File SHA Hash</label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 w-[90vw]">
                        <input type="text"
                          value={fileSHA}
                          onChange={(event) => {
                            setFileSHA(event.target.value);
                          }}
                          name="github_url_file_sha" id="github_url_file_sha" autoComplete="github_url_file_sha" className="flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6 " placeholder="" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-start gap-x-6">
                <button type="submit" disabled={processing} className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">

                  {!processing && 'Check'}
                  <span className="flex items-center gap-x-2">
                    {processing && <svg aria-hidden="true" className="w-6 h-6 text-gray-200 animate-spin dark:text-white-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>}
                    {processing && 'Checking'}
                  </span>
                </button>

                <button type="button" className="rounded-md bg-white text-red-500 px-3 py-2 text-sm font-semibold hover:text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  onClick={clearForm}>
                  Clear
                </button>

                {validationError != '' && <div className="">
                  <div>
                    <div className=" bg-red-500 text-sm text-white rounded-md shadow-lg  mb-3 ml-3" role="alert">
                      <div className="flex p-4">
                        {validationError}
                      </div>
                    </div>
                  </div>
                </div>}
              </div>
            </div>
          </form>}


          {activeTab == 'history' && <div className="">
            {history.length == 0 && <div className="">History Unavailable.</div>}

            <div className="max-h-[300px] overflow-auto flex flex-col w-auto">
              {history.map((historyItem, i) => {
                return <div key={i} className="flex items-center mb-3 border border-gray-400 shadow rounded p-3 gap-x-3">
                  <div className="flex flex-col divide-y-2 divide-gray-200">
                    <div className="">
                      <b className="text-gray-700">Repository URL</b> &nbsp;&nbsp;
                      {historyItem.githubURL}
                    </div>
                    <div className="">
                      <b className="text-gray-700">File SHA</b> &nbsp;&nbsp;
                      {historyItem.fileSHA}
                    </div>
                  </div>
                  <div className="">
                    <button type="submit" disabled={processing}
                      onClick={() => { checkAgain(historyItem) }}
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
                      Check Again
                    </button>
                  </div>
                </div>
              })}
            </div>
          </div>}
        </div>
        <div className="w-full h-1.5">
          {processing && <div className="h-1.5 w-full bg-blue-100 overflow-hidden">
            <div className="progress w-full h-full bg-blue-500 left-right"></div>
          </div>}
        </div>

        {resultsError && <div className="flex flex-row w-full justify-center">
          <div className=" bg-red-500 text-sm text-white rounded-md shadow-lg  mb-3 ml-3" role="alert">
            <div className="flex p-4">
              Oops! An unexpected error occured while reviewing the source code.
            </div>
          </div>
        </div>}

        {resultsLoaded && <nav className="flex flex-col sm:flex-row">
          <button className={"py-4 px-6 block  focus:outline-none border-b-2 font-medium  " + (resultsActiveTab == 'codeQualityReview' ? 'hover:text-blue-500 text-blue-500 border-blue-500' : 'text-gray-600 border-transparent')}
            onClick={() => { setResultsActiveTab('codeQualityReview') }}>
            Code Quality Review
          </button>
          <button className={"py-4 px-6 block  focus:outline-none border-b-2 font-medium  " + (resultsActiveTab == 'fileContent' ? 'hover:text-blue-500 text-blue-500 border-blue-500' : 'text-gray-600 border-transparent')}
            onClick={() => { setResultsActiveTab('fileContent') }}>
            Source Code
          </button>
          <button className={"py-4 px-6 block  focus:outline-none border-b-2 font-medium  " + (resultsActiveTab == 'trends' ? 'hover:text-blue-500 text-blue-500 border-blue-500' : 'text-gray-600 border-transparent')}
            onClick={() => { setResultsActiveTab('trends') }}>
            Trend Analysis
          </button>
        </nav>}
        {resultsLoaded && <div className="grow w-full border border-gray-200 shadow rounded-sm relative">

          <div className="absolute w-full h-full overflow-auto flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md ">

            {resultsActiveTab == 'fileContent' && <div className="p-5">
              <SyntaxHighlighter language="javascript" style={docco}>
                {fileContent}
              </SyntaxHighlighter>
            </div>}
            {resultsActiveTab == 'codeQualityReview' && <div className="border-t border-blue-gray-50 p-4 leading-8">
              <div className="text-2xl bg-clip-border rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg  grid h-16 w-32 place-items-center">
                {score}/10
              </div>
              <Markdown>{explanation}</Markdown>
            </div>}

            {resultsActiveTab == 'trends' && <div className="border-t border-blue-gray-50 p-4 leading-8">
              A graphic visualization can be displayed showing the historical trends of the code quality score
              <Image src="/graph.png" alt="graph" width={644} height={457} />
            </div>}
          </div>
        </div>}
      </main>
    </div>
  );
}
