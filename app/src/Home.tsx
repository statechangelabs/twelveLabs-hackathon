import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import { MusicalNoteIcon, XMarkIcon } from "@heroicons/react/24/outline";
import "plyr-react/plyr.css";
import Plyr, { PlyrInstance } from "plyr-react";
import { Dialog, Transition } from "@headlessui/react";
import AudioPlayer from "react-audio-player";
import music from "./assets/waitmusic.mp3";
const searchURL = "https://api.statechange.ai/api:3JtXDKzd/search";
const Home: FC = () => {
  const [results, setResults] = useState([] as any[]);
  const audioRef = useRef<{ audioEl: { current: HTMLAudioElement } }>(null);
  const [pauseMusic, setPauseMusic] = useState(false);
  useEffect(() => {
    if (pauseMusic) {
      audioRef.current?.audioEl?.current?.pause();
    } else {
      audioRef.current?.audioEl?.current?.play();
    }
  }, [pauseMusic]);
  const search = useCallback(async (query: string) => {
    console.log("I am searching");
    const response = await fetch(searchURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setResults(data);
    }
  }, []);
  const [started, setStarted] = useState(false);
  return (
    <div className="">
      <AudioPlayer src={music} ref={audioRef as any} />
      <div className="z-10">
        <div>
          <div className="p-10  rounded-md text-7xl font-extrabold text-center text-red-500">
            Chessboxing AI Clips
          </div>
          {!started && (
            <div className="flex flex-row justify-center">
              <button
                className="text-2xl font-bold bg-blue-500 hover:bg-blue-800 text-white p-5 rounded-md animated-all duration-200"
                onClick={() => {
                  setStarted(true);
                }}
              >
                Discover the future of sport
              </button>
            </div>
          )}
        </div>
        <Transition
          show={started}
          enter="transition-opacity duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
            <button
              className="ml-10 bg-blue-500 hover:bg-blue-800 text-white p-2 px-4 rounded-md"
              onClick={() => setPauseMusic(!pauseMusic)}
            >
              <MusicalNoteIcon className="h-8 w-8 inline mr-2" />
              {pauseMusic ? "Play Music" : "Pause Music"}
            </button>
            <div className="bg-opacity-80 bg-white m-10 p-5 gap-y-2 flex-col flex rounded-lg">
              <Formik
                initialValues={{ search: "" }}
                validate={(values) => {
                  const errors: Record<string, string> = {};
                  if (!values.search) {
                    errors.search = "Required";
                  }
                  return errors;
                }}
                onSubmit={async (values, form) => {
                  form.setSubmitting(true);

                  setResults([]);
                  console.log("ref is ", audioRef.current);

                  await search(values.search);
                  //   audioRef.current?.audioEl.current?.pause();
                  form.setSubmitting(false);
                }}
              >
                {({ dirty, isSubmitting, setFieldValue, values }) => (
                  <Form>
                    <div className="flex flex-row">
                      <Field
                        name="search"
                        type="text"
                        placeholder="Search for something awesome!"
                        className="flex-1 p-5 text-2xl border-gray-500 rounded-md text-md"
                      />
                      {!!values.search && (
                        <button
                          onClick={() => setFieldValue("search", "")}
                          type="button"
                          className="pl-2 text-gray-500 hover:text-gray-800 animated-all duration-200"
                          title="Clear search"
                        >
                          <XMarkIcon className="h-8 w-8" />
                        </button>
                      )}
                    </div>
                    <div className="w-full flex flex-row justify-center mt-2">
                      <div className="mx-auto">
                        <button
                          type="submit"
                          disabled={!dirty || isSubmitting}
                          className={
                            "mx-auto rounded-md p-2 text-xl font-bold " +
                            (!dirty || isSubmitting
                              ? "bg-gray-500 text-white"
                              : "bg-blue-500 hover:bg-blue-800 text-white ")
                          }
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            {!!results && <Results results={results} audioRef={audioRef} />}
          </div>
        </Transition>
      </div>
      <div
        className="h-screen w-screen fixed  top-0 left-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/bg.webp')", zIndex: -20 }}
      ></div>
    </div>
  );
};
const Results: FC<{ results: unknown[]; audioRef: any }> = ({
  results,
  audioRef,
}) => {
  console.log("Starting results");

  const [plyrInfo, setPlyrInfo] = useState<any | undefined>(undefined);
  const showPlyr = (info: any) => {
    setPlyrInfo(info);
    console.log("let's go with ", info);
  };
  const plyrRef = useRef<{ plyr: PlyrInstance }>();
  useEffect(() => {
    if (plyrInfo && plyrRef.current) {
      console.log("let's play", plyrRef.current.plyr);
      setTimeout(() => {
        audioRef.current?.audioEl.current?.pause();
        plyrRef.current?.plyr.forward(plyrInfo.start);
        plyrRef.current?.plyr.play();
        plyrRef.current?.plyr.on("timeupdate", (event: any) => {
          console.log(
            "Checking time",
            event.detail.plyr.currentTime,
            plyrInfo.end
          );
          if (event.detail.plyr.currentTime >= plyrInfo.end) {
            plyrRef.current?.plyr.rewind(
              event.detail.plyr.currentTime - plyrInfo.start
            );
          }
        });
      }, 2000);
    } else {
      if (audioRef.current?.audioEl.current?.paused)
        audioRef.current?.audioEl.current?.play();
    }
  }, [plyrInfo]);
  return (
    <Fragment>
      <Dialog
        open={!!plyrInfo}
        onClose={() => setPlyrInfo(undefined)}
        className="fixed top-0 left-0 bg-black bg-opacity-50 w-screen h-screen z-50"
      >
        <Dialog.Panel className="m-20 p-10 rounded-lg bg-white">
          <Dialog.Title>{plyrInfo?.filename}</Dialog.Title>
          {/* <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description> */}
          {/* {plyrInfo} */}
          {plyrInfo && (
            <Plyr
              ref={plyrRef as any}
              source={{
                type: "video",
                sources: [{ src: plyrInfo.file_url, type: "video/mp4" }],
              }}
              options={{}}
            />
          )}
        </Dialog.Panel>
      </Dialog>
      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {results.map((result: any) => (
          <li
            key={result.video_id + result.start.toString()}
            className="relative"
          >
            <div
              className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100"
              onClick={() => {
                showPlyr(result);
              }}
            >
              <img
                src={result.thumbnail_url}
                alt=""
                className="pointer-events-none object-cover group-hover:opacity-75"
              />
              <button
                type="button"
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">
                  View details for {result.filename}
                </span>
              </button>
            </div>
            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
              {result.filename}
            </p>
            <p className="pointer-events-none block text-sm font-medium text-gray-500">
              {result.score.toFixed(0)}%
            </p>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

export default Home;
