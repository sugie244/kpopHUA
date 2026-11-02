import './App.css'
import useReadCSV from "./hooks/useReadCSV.tsx";
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerProvider,
    MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {useEffect, useState} from "react";



function App() {

    const csvData = useReadCSV();
    const NAME = "yara";
    const PLATFORM = "Bubble";
    const SONG = "Bees";
    const GROUP = "82major";
    const PET = "binnie";
    const SIBLING = "omar";

    const processedRows = csvData?.data.map((row, index) => {
        const rawText = row[0] ?? "";

        const customParsed = rawText
            .replace(/PETSNAME/g, PET)
            .replace(/NAME/g, NAME)
            .replace(/PLATFORM/g, PLATFORM)
            .replace(/SONG/g, SONG)
            .replace(/GROUP/g, GROUP)
            .replace(/SIBLING/g, SIBLING);

        return {
            id: index,
            original: rawText,
            manipulated: customParsed,
        };
    }) ?? [];


    // randomize them
    const randomizedRows = processedRows
        ? [...processedRows].sort(() => Math.random() - 0.5)
        : [];

    const [messages, setMessages] = useState<Array<{ id: number; original: string; manipulated: string }>>([]);

    useEffect(() => {
        if (randomizedRows.length === 0) return;

        let currentIndex = 0;

        if(!idol) return;

        const intervalId = setInterval(() => {
            if (currentIndex < randomizedRows.length) {
                const nextRow = randomizedRows[currentIndex];

                setMessages((prev) => [...prev, nextRow]);
                currentIndex++;
            } else {
                clearInterval(intervalId);
            }
        }, 750);

        return () => clearInterval(intervalId);
    }, [randomizedRows]);

    const [idol, setIdol] = useState<string | null>(null);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const message = formData.get("message") as string;

        setIdol(message);
        console.log(message)
        e.currentTarget.reset();
    }


  return (
      <>
          <div className="flex h-screen w-full items-center justify-center bg-[#ECF8F4]">
              <div className="flex h-full w-120 bg-white flex-col">
                  <div className="h-1/12 items-center bg-[#C1E8DC] flex justify-center relative px-4">
                      <div>
                          {NAME}'s Fans :D
                      </div>
                      <div className="absolute right-4">
                          Settings
                      </div>
                  </div>

                  <div className="flex-1 h-9/12 px-2 py-2">
                      <MessageScrollerProvider defaultScrollPosition="end" autoScroll>
                          <MessageScroller >
                              <MessageScrollerViewport>
                                  <MessageScrollerContent className="flex flex-col gap-3">
                                      {idol ?
                                          <>
                                            <MessageScrollerItem className="flex justify-end" >
                                              <Bubble variant="idol" align="end">
                                                  <BubbleContent>{idol}</BubbleContent>
                                              </Bubble>
                                            </MessageScrollerItem>

                                              {messages.map((msg) => (
                                                  <MessageScrollerItem key={msg.id} messageId={String(msg.id)}>
                                                      <Bubble variant="fan">
                                                          <BubbleContent>{msg.manipulated}</BubbleContent>
                                                      </Bubble>
                                                  </MessageScrollerItem>
                                              ))}
                                          </>
                                          :null
                                      }
                                  </MessageScrollerContent>
                              </MessageScrollerViewport>
                              <MessageScrollerButton />
                          </MessageScroller>
                      </MessageScrollerProvider>
                  </div>
                  <form
                      onSubmit={handleSubmit}
                      className="flex h-1/12 w-11/12 mx-auto bg-[#C1E8DC] rounded-full mb-6">
                      <label htmlFor="first_name" className="block mb-2.5 text-sm font-medium text-heading"></label>
                      <input type="text" id="first_name"
                             className="bg-neutral-secondary-medium text-heading text-sm rounded-base w-6/7 px-3 py-2.5 placeholder:text-body outline-none"
                             name="message"
                             placeholder="Enter Message Here..." required/>
                      <button type="submit" className="text-gray-700">Send</button>
                  </form>
              </div>
          </div>

          {/*<form>*/}
          {/*    <div className="grid gap-6 mb-6 md:grid-cols-2">*/}
          {/*        <div>*/}
          {/*            <label htmlFor="first_name" className="block mb-2.5 text-sm font-medium text-heading">First*/}
          {/*                name</label>*/}
          {/*            <input type="text" id="first_name"*/}
          {/*                   className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"*/}
          {/*                   placeholder="John" required/>*/}
          {/*        </div>*/}
          {/*    </div>*/}
          {/*    <button type="submit"*/}
          {/*            className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">Submit*/}
          {/*    </button>*/}
          {/*</form>*/}


          {/*<div>*/}
              {/*printing them all out*/}
              {/*{randomizedRows?.map((item) => (*/}
              {/*    <div key={item.id}>*/}
              {/*        <p>{item.manipulated}</p>*/}
              {/*    </div>*/}
              {/*))}*/}
          {/*</div>*/}
      </>
  )
}

export default App
