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
import {useEffect, useRef, useState} from "react";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"




function App() {

    const [showSetup, setShowSetup] = useState(true);

    const csvData = useReadCSV();
    const [profile, setProfile] = useState({
        name: "yara",
        group: "82major",
        pet: "binnie",
        platform: "Bubble",
        song: "Bees",
        sibling: "omar",
    });
    const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        setProfile({
            name: (formData.get("name") as string) || "yara",
            group: (formData.get("group") as string) || "82major",
            pet: (formData.get("pet") as string) || "binnie",
            platform: (formData.get("platform") as string) || "Bubble",
            song: (formData.get("song") as string) || "Bees",
            sibling: (formData.get("sibling") as string) || "omar",
        });

        setShowSetup(false);
    };

    const processedRows = csvData?.data.map((row, index) => {
        const rawText = row[0] ?? "";

        const customParsed = rawText
            .replace(/PETSNAME/g, profile.pet)
            .replace(/NAME/g, profile.name)
            .replace(/PLATFORM/g, profile.platform)
            .replace(/SONG/g, profile.song)
            .replace(/GROUP/g, profile.group)
            .replace(/SIBLING/g, profile.sibling);

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

    const currentIntervalRef = useRef(1000);

    useEffect(() => {
        if (randomizedRows.length === 0 || !idol) return;

        let currentIndex = 0;
        let timeoutId : NodeJS.Timeout;

        const runTicker = () => {
            if (currentIndex < randomizedRows.length) {
                setMessages((prev) => [...prev, randomizedRows[currentIndex]]);
                currentIndex++;

                currentIntervalRef.current = Math.max(150, currentIntervalRef.current - 25);

                timeoutId = setTimeout(runTicker, currentIntervalRef.current);
            }
        };

        timeoutId = setTimeout(runTicker, currentIntervalRef.current);

        return () => clearTimeout(timeoutId);
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

                  <Dialog open={showSetup}>
                      <DialogContent className="sm:max-w-sm" showCloseButton={false}>
                          <form onSubmit={handleProfileSubmit}>
                              <DialogHeader>
                                  <DialogTitle>Welcome! Set up your profile</DialogTitle>
                                  <DialogDescription>
                                      Enter your preferences before starting the chat.
                                  </DialogDescription>
                              </DialogHeader>
                              <FieldGroup>
                                  <Field>
                                      <Label htmlFor="name-1">Name</Label>
                                      <Input id="name-1" name="name" defaultValue={profile.name} required />
                                  </Field>
                                  <Field>
                                      <Label htmlFor="group-1">Group</Label>
                                      <Input id="group-1" name="group" defaultValue={profile.group} required />
                                  </Field>
                                  <Field>
                                      <Label htmlFor="pet-1">Pet's Name</Label>
                                      <Input id="pet-1" name="pet" defaultValue={profile.pet} required />
                                  </Field>
                                  <Field>
                                      <Label htmlFor="platform-1">Platform</Label>
                                      <Input id="platform-1" name="platform" defaultValue={profile.platform} required />
                                  </Field>
                                  <Field>
                                      <Label htmlFor="song-1">Song</Label>
                                      <Input id="song-1" name="song" defaultValue={profile.song} required />
                                  </Field>
                                  <Field>
                                      <Label htmlFor="sibling-1">Sibling</Label>
                                      <Input id="sibling-1" name="sibling" defaultValue={profile.sibling} required />
                                  </Field>
                              </FieldGroup>
                              <DialogFooter className="mt-4">
                                  <Button type="submit">Start Chat</Button>
                              </DialogFooter>
                          </form>
                      </DialogContent>
                  </Dialog>

                  <div className="h-1/12 items-center bg-[#C1E8DC] flex justify-center relative px-4">
                      <div>
                          {profile.name}'s Fans :D
                      </div>
                      <div className="absolute right-4">
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
