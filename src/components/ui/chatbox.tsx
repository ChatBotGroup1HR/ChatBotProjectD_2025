import './chatbox.css';

export default function Chatbox() {
    return (
        <div className="chatbox-container">
            <div className="chatbox-area">
                <div className="chatbox-messages">
                </div>
                <div className="chatbox-input-area">
                    <input
                        type="text"
                        className="chatbox-input"
                        placeholder="Stel een vraag"
                    />
                    <button className="chatbox-button">➤</button>
                </div>
            </div>
        </div>
    );
}
