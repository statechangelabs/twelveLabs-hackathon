import { FC, Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  MusicalNoteIcon,
  PlayIcon,
  ShareIcon,
  SpeakerXMarkIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import "plyr-react/plyr.css";
import Plyr, { PlyrInstance } from "plyr-react";
import { Dialog, Transition } from "@headlessui/react";
import AudioPlayer from "react-audio-player";
import song1 from "./assets/song1.mp3";
import song2 from "./assets/song2.mp3";
import song3 from "./assets/song3.mp3";
import song4 from "./assets/song4.mp3";
import song5 from "./assets/song5.mp3";
import song6 from "./assets/song6.mp3";

const sources = [song1, song2, song3, song4, song5, song6];
const thisSong = sources[Math.floor(Math.random() * sources.length)];
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
      <AudioPlayer src={thisSong} ref={audioRef as any} />
      <div className="z-10">
        <div>
          <div className="p-10 bg-opacity-30 bg-black rounded-md text-7xl font-extrabold  text-red-500 justify-around flex flex-row">
            <div>
              <div>Chessboxing AI Clips</div>
              <div className="text-xl font-medium text-green-200 mt-2">
                Powered By{" "}
                <a
                  href="https://twelvelabs.io"
                  className="text-blue-300 hover:text-blue-500"
                >
                  Twelve Labs
                </a>{" "}
                Video Insights. A{" "}
                <a
                  href="https://statechange.ai"
                  className="text-blue-300 hover:text-blue-500"
                >
                  State Change
                </a>{" "}
                Contribution to Society
              </div>
            </div>
            {started && (
              <div className="flex flex-col gap-y-2">
                <button
                  className="block w-full my-auto h-12 text-sm bg-blue-500 hover:bg-blue-800 text-white p-2 px-4 rounded-md"
                  onClick={() => setPauseMusic(!pauseMusic)}
                >
                  <MusicalNoteIcon className="h-8 w-8 inline mr-2" />
                  {pauseMusic ? "Play Music" : "Pause Music"}
                </button>
                <button
                  className="block w-full my-auto h-12 text-sm bg-blue-500 hover:bg-blue-800 text-white p-2 px-4 rounded-md"
                  onClick={() => {
                    if (audioRef.current?.audioEl.current) {
                      const thisSong = audioRef.current?.audioEl.current.src;
                      do {
                        audioRef.current.audioEl.current.src =
                          sources[Math.floor(Math.random() * sources.length)];
                      } while (
                        thisSong === audioRef.current?.audioEl.current.src
                      );
                    }
                    if (!pauseMusic) audioRef.current?.audioEl.current?.play();
                  }}
                >
                  <MusicalNoteIcon className="h-8 w-8 inline mr-2" />
                  Change Song
                </button>
              </div>
            )}
          </div>
          {!started && (
            <div className="flex flex-row justify-center mt-10">
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
          enter="transition-opacity duration-1000"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div>
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
                    <div>
                      Chessboxing is the most amazing sport that you never knew
                      existed. Learn more about Chessboxing through finding
                      exciting clips that showcase your interest in the sport.
                      How about{" "}
                      <button
                        className="text-blue-500 hover:text-blue-800"
                        onClick={() => setFieldValue("search", "knockouts")}
                      >
                        Knockouts?
                      </button>{" "}
                      <button
                        className="text-blue-500 hover:text-blue-800"
                        onClick={() => setFieldValue("search", "checkmates")}
                      >
                        Checkmates?
                      </button>{" "}
                      Maybe you prefer{" "}
                      <button
                        className="text-blue-500 hover:text-blue-800"
                        onClick={() =>
                          setFieldValue("search", "cannot play chess")
                        }
                      >
                        Terrible Moves?
                      </button>{" "}
                      Discover the videos that matter to you.
                    </div>
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
            {!!results && (
              <Results
                results={results}
                audioRef={audioRef}
                pauseMusic={pauseMusic}
              />
            )}
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
const Results: FC<{
  results: unknown[];
  audioRef: any;
  pauseMusic: boolean;
}> = ({ results, audioRef, pauseMusic }) => {
  console.log("Starting results");
  const [selected, setSelected] = useState<any[]>([]);
  useEffect(() => {
    setSelected([]);
  }, [results]);
  const [plyrInfo, setPlyrInfo] = useState<any | undefined>(undefined);
  const showPlyr = (info: any) => {
    setPlyrInfo(info);
    console.log("let's go with ", info);
  };
  const plyrRef = useRef<{ plyr: PlyrInstance }>();
  const loopEnabledRef = useRef(false);
  const [loopEnabled] = useState(true);
  useEffect(() => {
    loopEnabledRef.current = loopEnabled;
  }, [loopEnabled]);
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
          if (
            event.detail.plyr.currentTime >= plyrInfo.end &&
            loopEnabledRef.current
          ) {
            plyrRef.current?.plyr.rewind(
              event.detail.plyr.currentTime - plyrInfo.start
            );
          }
        });
      }, 2000);
    } else {
      if (audioRef.current?.audioEl.current?.paused && !pauseMusic)
        audioRef.current?.audioEl.current?.play();
    }
  }, [plyrInfo, audioRef, pauseMusic]);
  const [showShare, setShowShare] = useState(false);
  return (
    <Fragment>
      <Dialog
        open={!!plyrInfo}
        onClose={() => setPlyrInfo(undefined)}
        className="fixed top-0 left-0 bg-black bg-opacity-50 w-screen h-screen z-50"
      >
        <Dialog.Panel className="m-20 p-10 rounded-lg bg-white">
          <div className="flex flex-row justify-between">
            <Dialog.Title className="text-2xl font-bold">
              Clip Preview
            </Dialog.Title>
            <button
              onClick={() => setPlyrInfo(undefined)}
              className="text-2xl font-bold text-blue-500 hover:text-blue-800 p-2 rounded-md  animated-all duration-200"
            >
              <XMarkIcon className="h-8 w-8 inline mr-2" />
            </button>
          </div>
          {plyrInfo?.filename}
          {/* <Dialog.Description>
          This will permanently deactivate your account
        </Dialog.Description> */}
          {/* {plyrInfo} */}
          {plyrInfo && (
            <Plyr
              id={"plyr" + plyrInfo.video_id}
              key={"plyr" + plyrInfo.video_id}
              ref={plyrRef as any}
              source={{
                type: "video",
                sources: [{ src: plyrInfo.file_url, type: "video/mp4" }],
              }}
              options={{}}
            />
          )}
          {/* <button onClick={() => setLoopEnabled(!loopEnabled)}>
            {loopEnabled ? "Disable" : "Enable"} Target Clip Looping
          </button> */}
        </Dialog.Panel>
      </Dialog>
      <Dialog
        open={showShare}
        onClose={() => setShowShare(false)}
        className="fixed top-0 left-0 bg-black bg-opacity-50 w-screen h-screen z-50"
      >
        <Dialog.Panel className="p-10 rounded-lg bg-white m-20 ">
          <div className="flex flex-row justify-between">
            <Dialog.Title className="text-2xl font-bold">
              Share Clip
            </Dialog.Title>
            <button
              onClick={() => setShowShare(false)}
              className="text-2xl font-bold text-blue-500 hover:text-blue-800 p-2 rounded-md  animated-all duration-200"
            >
              <XMarkIcon className="h-8 w-8 inline mr-2" />
            </button>
          </div>
          <Dialog.Description>
            Convert these clips to an awesome TikTok compatible (60s max)
            highlights reel!
          </Dialog.Description>
          <div className="flex flex-row justify-start ml-10">
            <div className="flex flex-col gap-y-4 mt-4">
              <li
                onClick={() => {
                  console.log("No music", selected);
                }}
                className="text-blue-500 hover:text-blue-800 cursor-pointer"
              >
                <SpeakerXMarkIcon className="h-8 w-8 mr-2 inline-block" />
                Make Clips Without Music
              </li>
              <li
                onClick={() => {
                  console.log("Add Music", selected);
                }}
                className="text-blue-500 hover:text-blue-800 cursor-pointer"
              >
                <MusicalNoteIcon className="h-8 w-8 mr-2 inline-block" />
                Add Chessboxing Music
              </li>

              <li
                onClick={() => {
                  setShowShare(false);
                }}
                className="text-red-500 hover:text-red-800 cursor-pointer"
              >
                <XCircleIcon className="h-8 w-8 mr-2 inline-block" />
                Never Mind
              </li>
            </div>
          </div>

          <div className="flex flex-row justify-center"></div>
        </Dialog.Panel>
      </Dialog>
      <div className="my-10 bg-opacity-80 bg-black p-10">
        {!!selected.length && (
          <div className="text-white text-2xl font-bold">
            Results!{" "}
            <span className="font-medium text-lg">
              Hover over a found clip below. Click the{" "}
              <PlayIcon className="inline h-5 w-5" />
              <span className="font-bold">Play</span> button to preview the clip
              in the context of the match, and{" "}
              <ShareIcon className="inline h-5 w-5" />
              <span className="font-bold">Share</span> to build a list of
              highlights to share on social media!
            </span>
          </div>
        )}
        {!!selected.length && (
          <div className="flex flex-row justify-center">
            <button
              onClick={() => setShowShare(true)}
              className="text-white bg-blue-500 hover:bg-blue-800 p-2 px-4 rounded-md"
            >
              Share {selected.length} Clip{selected.length > 1 && "s"}
            </button>
          </div>
        )}
      </div>
      <ul
        role="list"
        className="mx-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {results.map((result: any) => (
          <li
            key={result.video_id + result.start.toString()}
            className="relative bg-white rounded-lg shadow-lg p-5 overflow-hidden bg-opacity-80 bg-gray-100 hover:bg-opacity-100 animated-all duration-200 group"
          >
            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
              {" "}
              <div
                className="top-10 left-10 font-bold hidden group-hover:block absolute  text-2xl z-10 hover:text-blue-500"
                onClick={() => {
                  showPlyr(result);
                }}
              >
                <PlayIcon className="h-20 w-20 inline mr-2" />
              </div>
              <div
                className="right-10 top-10 font-bold hidden group-hover:block absolute text-2xl z-10 hover:text-blue-500"
                onClick={() => {
                  setSelected((old) => [...old, result]);
                }}
              >
                <ShareIcon className="h-20 w-20 inline mr-2" />
              </div>
              <img
                src={result.thumbnail_url}
                alt=""
                className="pointer-events-none object-cover group-hover:opacity-50"
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
              Duration: {(result.end - result.start).toFixed(2)}s{" "}
            </p>{" "}
            <p className="pointer-events-none block text-sm font-medium text-gray-500">
              Confidence: {result.confidence} ({result.score.toFixed(0)}%)
            </p>
          </li>
        ))}
      </ul>
    </Fragment>
  );
};

export default Home;
