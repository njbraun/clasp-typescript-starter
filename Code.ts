/*global UrlFetchApp Logger PropertiesService MailApp*/
/*exported main*/

interface HTTPResponse {
    results: Result[];
    info: Info;
}

interface Info {
    seed: string;
    results: number;
    page: number;
    version: string;
}

interface Result {
    gender: string;
    name: Name;
    location: Location;
    email: string;
    login: Login;
    dob: Dob;
    registered: Dob;
    phone: string;
    cell: string;
    id: ID;
    picture: Picture;
    nat: string;
}

interface Dob {
    date: Date;
    age: number;
}

interface ID {
    name: string;
    value: string;
}

interface Location {
    street: Street;
    city: string;
    state: string;
    country: string;
    postcode: number;
    coordinates: Coordinates;
    timezone: Timezone;
}

interface Coordinates {
    latitude: string;
    longitude: string;
}

interface Street {
    number: number;
    name: string;
}

interface Timezone {
    offset: string;
    description: string;
}

interface Login {
    uuid: string;
    username: string;
    password: string;
    salt: string;
    md5: string;
    sha1: string;
    sha256: string;
}

interface Name {
    title: string;
    first: string;
    last: string;
}

interface Picture {
    large: string;
    medium: string;
    thumbnail: string;
}

const LAST_KEY = 'LAST' as const;

const fetch_ = <T>(url: string): T =>
    JSON.parse(UrlFetchApp.fetch(url).getContentText());

const main = (): void => {
    const scriptProperties = PropertiesService.getScriptProperties();
    const resp = fetch_<HTTPResponse>('https://randomuser.me/api');
    Logger.log(resp);

    // Extract out the thing you want to watch
    const { cell: newValue } = resp.results[0];
    // Get previously fetched value
    const prevValue = scriptProperties.getProperty(LAST_KEY);
    if (prevValue !== newValue) {
        // Update previously fetched value w/ latest
        scriptProperties.setProperty(LAST_KEY, newValue);
        // Notify change
        MailApp.sendEmail({
            to: '1231231234@msg.fi.google.com',
            subject: 'Cell Changed!',
            htmlBody: `<em>New Value:</em> ${newValue}`,
        });
    }
};
