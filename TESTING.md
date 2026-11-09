# Test Plan and Results

| Test                | Steps                                    | Expected result                                | Result                                                                            |
| ------------------- | ---------------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Initial load        | Open `index.html` with internet access   | Default Siliguri weather loads                 | Pass (mocked browser verification; live API should be verified in user's network) |
| Valid city          | Search `London`                          | Location and forecast panels update            | Pass (mocked browser verification)                                                |
| Unknown city        | Search a random invalid city             | Friendly not-found error; no broken forecast   | Pass (mocked browser verification)                                                |
| Blank input         | Submit an empty search                   | Validation message appears                     | Pass (code-path review)                                                           |
| Loading state       | Submit a city while requests are pending | Loading message appears and button is disabled | Pass (mocked browser verification)                                                |
| Network/API failure | Make an API request fail                 | Error message appears and button is re-enabled | Pass (code-path review)                                                           |
| Responsive layout   | View at desktop and mobile widths        | Content adapts without horizontal overflow     | Pass (browser screenshot verification)                                            |

## Automated checks performed

- JavaScript syntax checked using `node --check`.
- Browser render checked using Chromium at desktop and mobile viewport sizes.
- API responses were mocked for deterministic screenshot and interaction checks. This verifies the UI flow, not live API uptime or real weather accuracy.
