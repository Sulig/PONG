import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBox from "../components/ChatBox"
const Chat = () => {
    return (
        <div className='min-h-screen bg-bg-primary text-text-primary flex flex-col'>
            <Header />
            <div className="flex lg:justify-center flex-1">
              <div className=" w-full lg:w-200 ">
                <ChatBox />
              </div>
            </div>
            <Footer />
        </div>
    )
}

export default Chat;