import {User} from "../../common/interfaces";
export function Chatrooms(props: User) {
  const { chatrooms } = props;
    return (
        <div>
            <h2>Chatrooms</h2>
            {chatrooms && chatrooms.length > 0 ? (
                <ul>
                    {chatrooms.map((room, index) => (
                        <li key={index}>{room}</li>
                    ))}
                </ul>
            ) : (
                <p>No chatrooms available.</p>
            )}
        </div>
    )
}