export interface MediaConvertEvent {
    version:       string;
    id:            string;
    "detail-type": string;
    source:        string;
    account:       string;
    time:          Date;
    region:        string;
    resources:     string[];
    detail:        Detail;
}

export interface Detail {
    timestamp:           number;
    accountId:           string;
    queue:               string;
    jobId:               string;
    status:              string;
    userMetadata:        UserMetadata;
    inputDetails?:       InputDetail[];
    outputGroupDetails?: OutputGroupDetail[];
}

export interface InputDetail {
    id:    number;
    uri:   string;
    video: Video[];
    audio: Audio[];
    data:  null;
}

export interface Audio {
    streamId:   number;
    codec:      string;
    channels:   number;
    sampleRate: number;
    language:   string;
}

export interface Video {
    streamId:      number;
    width:         number;
    height:        number;
    frameRate:     number;
    sar:           string;
    bitDepth:      number;
    interlaceMode: string;
    colorFormat:   string;
    standard:      string;
    fourCC:        string;
}

export interface OutputGroupDetail {
    outputDetails: OutputDetail[];
}

export interface OutputDetail {
    durationInMs: number;
    videoDetails: VideoDetails;
}

export interface VideoDetails {
    widthInPx:  number;
    heightInPx: number;
}

export interface UserMetadata {
}

