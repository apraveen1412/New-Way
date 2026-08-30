export default function QueryBox(){
    let URL_ENDPOINT = 'http://localhost:8080/conversation';
    return(
        <form action={URL_ENDPOINT} method="post">
            <input type="text" name="userQuery" placeholder="Ask something..."/>
            <button type="submit">Get</button>
        </form>
    );
}