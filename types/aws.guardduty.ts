// To parse this data:
//
//   import { Convert } from "./file";
//
//   const awsGuardduty = Convert.toAwsGuardduty(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface AwsGuardduty {
    version:       string;
    id:            string;
    "detail-type": string;
    source:        string;
    account:       string;
    time:          Date;
    region:        string;
    resources:     any[];
    detail:        Detail;
}

export interface Detail {
    schemaVersion: string;
    accountId:     string;
    region:        string;
    partition:     string;
    id:            string;
    arn:           string;
    type:          string;
    resource:      Resource;
    service:       Service;
    severity:      number;
    createdAt:     Date;
    updatedAt:     Date;
    title:         string;
    description:   string;
}

export interface Resource {
    resourceType:    string;
    instanceDetails: InstanceDetails;
}

export interface InstanceDetails {
    instanceId:        string;
    instanceType:      string;
    launchTime:        number;
    productCodes:      any[];
    networkInterfaces: NetworkInterface[];
    tags:              Tag[];
    instanceState:     string;
    availabilityZone:  string;
    imageId:           string;
    imageDescription:  string;
}

export interface NetworkInterface {
    ipv6Addresses:      any[];
    privateDnsName:     string;
    privateIpAddress:   string;
    privateIpAddresses: PrivateIPAddress[];
    subnetId:           string;
    vpcId:              string;
    securityGroups:     SecurityGroup[];
    publicDnsName:      string;
    publicIp:           string;
}

export interface PrivateIPAddress {
    privateDnsName:   string;
    privateIpAddress: string;
}

export interface SecurityGroup {
    groupName: string;
    groupId:   string;
}

export interface Tag {
    key:   string;
    value: string;
}

export interface Service {
    serviceName:    string;
    detectorId:     string;
    action:         Action;
    resourceRole:   string;
    additionalInfo: AdditionalInfo;
    eventFirstSeen: Date;
    eventLastSeen:  Date;
    archived:       boolean;
    count:          number;
}

export interface Action {
    actionType:              string;
    networkConnectionAction: NetworkConnectionAction;
}

export interface NetworkConnectionAction {
    connectionDirection: string;
    remoteIpDetails:     RemoteIPDetails;
    remotePortDetails:   PortDetails;
    localPortDetails:    PortDetails;
    protocol:            string;
    blocked:             boolean;
}

export interface PortDetails {
    port:     number;
    portName: string;
}

export interface RemoteIPDetails {
    ipAddressV4:  string;
    organization: Organization;
    country:      Country;
    city:         City;
    geoLocation:  GeoLocation;
}

export interface City {
    cityName: string;
}

export interface Country {
    countryName: string;
}

export interface GeoLocation {
    lat: number;
    lon: number;
}

export interface Organization {
    asn: number;
    isp: string;
    org: string;
}

export interface AdditionalInfo {
    unusualProtocol: string;
    threatListName:  string;
    unusual:         number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toAwsGuardduty(json: string): AwsGuardduty[] {
        return cast(JSON.parse(json), a(r("AwsGuardduty")));
    }

    public static awsGuarddutyToJson(value: AwsGuardduty[]): string {
        return JSON.stringify(uncast(value, a(r("AwsGuardduty"))), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "AwsGuardduty": o([
        { json: "version", js: "version", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "detail-type", js: "detail-type", typ: "" },
        { json: "source", js: "source", typ: "" },
        { json: "account", js: "account", typ: "" },
        { json: "time", js: "time", typ: Date },
        { json: "region", js: "region", typ: "" },
        { json: "resources", js: "resources", typ: a("any") },
        { json: "detail", js: "detail", typ: r("Detail") },
    ], false),
    "Detail": o([
        { json: "schemaVersion", js: "schemaVersion", typ: "" },
        { json: "accountId", js: "accountId", typ: "" },
        { json: "region", js: "region", typ: "" },
        { json: "partition", js: "partition", typ: "" },
        { json: "id", js: "id", typ: "" },
        { json: "arn", js: "arn", typ: "" },
        { json: "type", js: "type", typ: "" },
        { json: "resource", js: "resource", typ: r("Resource") },
        { json: "service", js: "service", typ: r("Service") },
        { json: "severity", js: "severity", typ: 0 },
        { json: "createdAt", js: "createdAt", typ: Date },
        { json: "updatedAt", js: "updatedAt", typ: Date },
        { json: "title", js: "title", typ: "" },
        { json: "description", js: "description", typ: "" },
    ], false),
    "Resource": o([
        { json: "resourceType", js: "resourceType", typ: "" },
        { json: "instanceDetails", js: "instanceDetails", typ: r("InstanceDetails") },
    ], false),
    "InstanceDetails": o([
        { json: "instanceId", js: "instanceId", typ: "" },
        { json: "instanceType", js: "instanceType", typ: "" },
        { json: "launchTime", js: "launchTime", typ: 0 },
        { json: "productCodes", js: "productCodes", typ: a("any") },
        { json: "networkInterfaces", js: "networkInterfaces", typ: a(r("NetworkInterface")) },
        { json: "tags", js: "tags", typ: a(r("Tag")) },
        { json: "instanceState", js: "instanceState", typ: "" },
        { json: "availabilityZone", js: "availabilityZone", typ: "" },
        { json: "imageId", js: "imageId", typ: "" },
        { json: "imageDescription", js: "imageDescription", typ: "" },
    ], false),
    "NetworkInterface": o([
        { json: "ipv6Addresses", js: "ipv6Addresses", typ: a("any") },
        { json: "privateDnsName", js: "privateDnsName", typ: "" },
        { json: "privateIpAddress", js: "privateIpAddress", typ: "" },
        { json: "privateIpAddresses", js: "privateIpAddresses", typ: a(r("PrivateIPAddress")) },
        { json: "subnetId", js: "subnetId", typ: "" },
        { json: "vpcId", js: "vpcId", typ: "" },
        { json: "securityGroups", js: "securityGroups", typ: a(r("SecurityGroup")) },
        { json: "publicDnsName", js: "publicDnsName", typ: "" },
        { json: "publicIp", js: "publicIp", typ: "" },
    ], false),
    "PrivateIPAddress": o([
        { json: "privateDnsName", js: "privateDnsName", typ: "" },
        { json: "privateIpAddress", js: "privateIpAddress", typ: "" },
    ], false),
    "SecurityGroup": o([
        { json: "groupName", js: "groupName", typ: "" },
        { json: "groupId", js: "groupId", typ: "" },
    ], false),
    "Tag": o([
        { json: "key", js: "key", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "Service": o([
        { json: "serviceName", js: "serviceName", typ: "" },
        { json: "detectorId", js: "detectorId", typ: "" },
        { json: "action", js: "action", typ: r("Action") },
        { json: "resourceRole", js: "resourceRole", typ: "" },
        { json: "additionalInfo", js: "additionalInfo", typ: r("AdditionalInfo") },
        { json: "eventFirstSeen", js: "eventFirstSeen", typ: Date },
        { json: "eventLastSeen", js: "eventLastSeen", typ: Date },
        { json: "archived", js: "archived", typ: true },
        { json: "count", js: "count", typ: 0 },
    ], false),
    "Action": o([
        { json: "actionType", js: "actionType", typ: "" },
        { json: "networkConnectionAction", js: "networkConnectionAction", typ: r("NetworkConnectionAction") },
    ], false),
    "NetworkConnectionAction": o([
        { json: "connectionDirection", js: "connectionDirection", typ: "" },
        { json: "remoteIpDetails", js: "remoteIpDetails", typ: r("RemoteIPDetails") },
        { json: "remotePortDetails", js: "remotePortDetails", typ: r("PortDetails") },
        { json: "localPortDetails", js: "localPortDetails", typ: r("PortDetails") },
        { json: "protocol", js: "protocol", typ: "" },
        { json: "blocked", js: "blocked", typ: true },
    ], false),
    "PortDetails": o([
        { json: "port", js: "port", typ: 0 },
        { json: "portName", js: "portName", typ: "" },
    ], false),
    "RemoteIPDetails": o([
        { json: "ipAddressV4", js: "ipAddressV4", typ: "" },
        { json: "organization", js: "organization", typ: r("Organization") },
        { json: "country", js: "country", typ: r("Country") },
        { json: "city", js: "city", typ: r("City") },
        { json: "geoLocation", js: "geoLocation", typ: r("GeoLocation") },
    ], false),
    "City": o([
        { json: "cityName", js: "cityName", typ: "" },
    ], false),
    "Country": o([
        { json: "countryName", js: "countryName", typ: "" },
    ], false),
    "GeoLocation": o([
        { json: "lat", js: "lat", typ: 0 },
        { json: "lon", js: "lon", typ: 0 },
    ], false),
    "Organization": o([
        { json: "asn", js: "asn", typ: 0 },
        { json: "isp", js: "isp", typ: "" },
        { json: "org", js: "org", typ: "" },
    ], false),
    "AdditionalInfo": o([
        { json: "unusualProtocol", js: "unusualProtocol", typ: "" },
        { json: "threatListName", js: "threatListName", typ: "" },
        { json: "unusual", js: "unusual", typ: 0 },
    ], false),
};
