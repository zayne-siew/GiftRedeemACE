/** An official response from the main server */
type ServerResponse = {
    message: string;
};

/**
 * Queries server with specified URL and input for result
 *
 * @remarks
 * The function assumes that a `ServerResponse` object is returned by the server.
 *
 * @param url - The URL to perform requests from
 * @param input - An input string to query the server with
 *
 * @returns The message returned by the server
 */
async function query(url: string, input: string): Promise<string> {
    // Set up POST query
    const headers: Headers = new Headers();
    headers.set('Content-Type', 'application/json');
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ input: input }),
    };

    // Fetch query and await response
    const response: Response = await fetch(url, requestOptions);
    if (response.ok) {
        const serverResponse: ServerResponse = await response.json();
        return serverResponse.message;
    } else {
        // log.fatal(new Error(response.statusText));
        return response.statusText;
    }
}

/** Handles button click to query server for staff pass ID */
function handleClick(): void {
    const port: number | string = 5500;
    const serverUrl: string = `http://127.0.0.1:${port}`;

    const inputValue: string = (document.getElementById('inputField') as HTMLInputElement).value;
    const messageLabel: HTMLElement | null = document.getElementById('messageLabel');

    if (messageLabel === null) {
        // log.fatal(new Error('HTML label element not found!'));
        return;
    }
    (async () => {
        messageLabel.textContent = await query(`${serverUrl}/redeem`, inputValue.trim());
    })();
}

/** Initialise the webpage */
function initialisePage(): void {
    // Create input field
    const inputField: HTMLInputElement = document.createElement('input');
    inputField.id = 'inputField';
    inputField.type = 'text';
    inputField.placeholder = 'Enter staff pass ID';

    // Create submit button
    const submitButton: HTMLButtonElement = document.createElement('button');
    submitButton.id = 'submitButton';
    submitButton.textContent = 'Verify';
    submitButton.addEventListener('click', handleClick);

    // Create message label
    const messageLabel: HTMLLabelElement = document.createElement('label');
    messageLabel.id = 'messageLabel';

    // Get the container div and append elements
    const container: HTMLElement | null = document.getElementById('container');
    if (container === null) {
        // log.fatal(new Error('HTML container not found!'));
        return;
    }
    container.appendChild(inputField);
    container.appendChild(submitButton);
    container.appendChild(messageLabel);

    // Add CSS styling
    const style = document.createElement('style');
    style.textContent = `
        #container {
            max-width: 400px;
            margin: 20px auto;
            padding: 20px;
            border: 2px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
            align-items: center;
            justify-content: center;
        }

        #inputField {
            width: calc(100% - 100px);
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }

        #submitButton {
            width: 100px;
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        #submitButton:hover {
            background-color: #0056b3;
        }

        #messageLabel {
            display: block;
            margin-top: 10px;
            font-size: 16px;
            color: #333;
        }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', initialisePage);
