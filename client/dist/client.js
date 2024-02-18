'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
var __generator =
    (this && this.__generator) ||
    function (thisArg, body) {
        var _ = {
                label: 0,
                sent: function () {
                    if (t[0] & 1) throw t[1];
                    return t[1];
                },
                trys: [],
                ops: [],
            },
            f,
            y,
            t,
            g;
        return (
            (g = { next: verb(0), throw: verb(1), return: verb(2) }),
            typeof Symbol === 'function' &&
                (g[Symbol.iterator] = function () {
                    return this;
                }),
            g
        );
        function verb(n) {
            return function (v) {
                return step([n, v]);
            };
        }
        function step(op) {
            if (f) throw new TypeError('Generator is already executing.');
            while ((g && ((g = 0), op[0] && (_ = 0)), _))
                try {
                    if (
                        ((f = 1),
                        y &&
                            (t =
                                op[0] & 2
                                    ? y['return']
                                    : op[0]
                                      ? y['throw'] ||
                                        ((t = y['return']) && t.call(y), 0)
                                      : y.next) &&
                            !(t = t.call(y, op[1])).done)
                    )
                        return t;
                    if (((y = 0), t)) op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (
                                !((t = _.trys),
                                (t = t.length > 0 && t[t.length - 1])) &&
                                (op[0] === 6 || op[0] === 2)
                            ) {
                                _ = 0;
                                continue;
                            }
                            if (
                                op[0] === 3 &&
                                (!t || (op[1] > t[0] && op[1] < t[3]))
                            ) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2]) _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                } catch (e) {
                    op = [6, e];
                    y = 0;
                } finally {
                    f = t = 0;
                }
            if (op[0] & 5) throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
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
function query(url, input) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, requestOptions, response, serverResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    headers = new Headers();
                    headers.set('Content-Type', 'application/json');
                    requestOptions = {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ input: input }),
                    };
                    return [4 /*yield*/, fetch(url, requestOptions)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    serverResponse = _a.sent();
                    return [2 /*return*/, serverResponse.message];
                case 3:
                    // log.fatal(new Error(response.statusText));
                    return [2 /*return*/, response.statusText];
            }
        });
    });
}
/** Handles button click to query server for staff pass ID */
function handleClick() {
    var _this = this;
    var port = 5500;
    var serverUrl = 'http://127.0.0.1:'.concat(port);
    var inputValue = document.getElementById('inputField').value;
    var messageLabel = document.getElementById('messageLabel');
    if (messageLabel === null) {
        // log.fatal(new Error('HTML label element not found!'));
        return;
    }
    (function () {
        return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = messageLabel;
                        return [
                            4 /*yield*/,
                            query(
                                ''.concat(serverUrl, '/redeem'),
                                inputValue.trim()
                            ),
                        ];
                    case 1:
                        _a.textContent = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    })();
}
/** Initialise the webpage */
function initialisePage() {
    // Create input field
    var inputField = document.createElement('input');
    inputField.id = 'inputField';
    inputField.type = 'text';
    inputField.placeholder = 'Enter staff pass ID';
    // Create submit button
    var submitButton = document.createElement('button');
    submitButton.id = 'submitButton';
    submitButton.textContent = 'Verify';
    submitButton.addEventListener('click', handleClick);
    // Create message label
    var messageLabel = document.createElement('label');
    messageLabel.id = 'messageLabel';
    // Get the container div and append elements
    var container = document.getElementById('container');
    if (container === null) {
        // log.fatal(new Error('HTML container not found!'));
        return;
    }
    container.appendChild(inputField);
    container.appendChild(submitButton);
    container.appendChild(messageLabel);
    // Add CSS styling
    var style = document.createElement('style');
    style.textContent =
        '\n        #container {\n            max-width: 400px;\n            margin: 20px auto;\n            padding: 20px;\n            border: 2px solid #ccc;\n            border-radius: 8px;\n            background-color: #f9f9f9;\n            align-items: center;\n            justify-content: center;\n        }\n\n        #inputField {\n            width: calc(100% - 100px);\n            padding: 10px;\n            margin-bottom: 15px;\n            border: 1px solid #ccc;\n            border-radius: 5px;\n            font-size: 16px;\n        }\n\n        #submitButton {\n            width: 100px;\n            padding: 10px;\n            background-color: #007bff;\n            color: #fff;\n            border: none;\n            border-radius: 5px;\n            cursor: pointer;\n            font-size: 16px;\n        }\n\n        #submitButton:hover {\n            background-color: #0056b3;\n        }\n\n        #messageLabel {\n            display: block;\n            margin-top: 10px;\n            font-size: 16px;\n            color: #333;\n        }\n    ';
    document.head.appendChild(style);
}
document.addEventListener('DOMContentLoaded', initialisePage);
