export interface AwsMediaconvert {
    $schema:     string;
    type:        string;
    items:       Items;
    definitions: Definitions;
}

export interface Definitions {
    AwsMediaconvertElement: AwsMediaconvertElement;
    Detail:                 Detail;
    InputDetail:            InputDetail;
    Audio:                  Audio;
    Video:                  Video;
    OutputGroupDetail:      OutputGroupDetail;
    OutputDetail:           OutputDetail;
    VideoDetails:           VideoDetails;
    UserMetadata:           UserMetadata;
}

export interface Audio {
    type:                 string;
    additionalProperties: boolean;
    properties:           AudioProperties;
    required:             string[];
    title:                string;
}

export interface AudioProperties {
    streamId:   Channels;
    codec:      Channels;
    channels:   Channels;
    sampleRate: Channels;
    language:   Channels;
}

export interface Channels {
    type: Type;
}

export enum Type {
    Integer = "integer",
    Null = "null",
    Number = "number",
    String = "string",
}

export interface AwsMediaconvertElement {
    type:                 string;
    additionalProperties: boolean;
    properties:           AwsMediaconvertElementProperties;
    required:             string[];
    title:                string;
}

export interface AwsMediaconvertElementProperties {
    version:       ID;
    id:            ID;
    "detail-type": Channels;
    source:        Channels;
    account:       Channels;
    time:          ID;
    region:        Channels;
    resources:     Resources;
    detail:        Items;
}

export interface Items {
    $ref: string;
}

export interface ID {
    type:   Type;
    format: string;
}

export interface Resources {
    type:  string;
    items: Channels;
}

export interface Detail {
    type:                 string;
    additionalProperties: boolean;
    properties:           DetailProperties;
    required:             string[];
    title:                string;
}

export interface DetailProperties {
    timestamp:          Channels;
    accountId:          Channels;
    queue:              Channels;
    jobId:              Channels;
    status:             Channels;
    userMetadata:       Items;
    inputDetails:       InputDetails;
    outputGroupDetails: InputDetails;
}

export interface InputDetails {
    type:  string;
    items: Items;
}

export interface InputDetail {
    type:                 string;
    additionalProperties: boolean;
    properties:           InputDetailProperties;
    required:             string[];
    title:                string;
}

export interface InputDetailProperties {
    id:    Channels;
    uri:   Channels;
    video: InputDetails;
    audio: InputDetails;
    data:  Channels;
}

export interface OutputDetail {
    type:                 string;
    additionalProperties: boolean;
    properties:           OutputDetailProperties;
    required:             string[];
    title:                string;
}

export interface OutputDetailProperties {
    durationInMs: Channels;
    videoDetails: Items;
}

export interface OutputGroupDetail {
    type:                 string;
    additionalProperties: boolean;
    properties:           OutputGroupDetailProperties;
    required:             string[];
    title:                string;
}

export interface OutputGroupDetailProperties {
    outputDetails: InputDetails;
}

export interface UserMetadata {
    type:                 string;
    additionalProperties: boolean;
    title:                string;
}

export interface Video {
    type:                 string;
    additionalProperties: boolean;
    properties:           { [key: string]: Channels };
    required:             string[];
    title:                string;
}

export interface VideoDetails {
    type:                 string;
    additionalProperties: boolean;
    properties:           VideoDetailsProperties;
    required:             string[];
    title:                string;
}

export interface VideoDetailsProperties {
    widthInPx:  Channels;
    heightInPx: Channels;
}
