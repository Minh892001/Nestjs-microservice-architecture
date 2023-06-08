import { PassportStrategy } from "@nestjs/passport";
import { Strategy,VerifyCallback } from "passport-google-oauth20";
import { Injectable} from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,'google') {
    constructor(){
        super({
            clientID: '940059582838-0b5g069d4oucqsnqng90pkif8jfkgj7b.apps.googleusercontent.com',
            clientSecret:'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',
            callbackURL: 'http://localhost:3001/google/auth/google/callback',
            scope: ['email', 'profile','openid','https://www.googleapis.com/auth/user.phonenumbers.read'],
            prompt: 'consent',
        });
    }

    async validate(accessToken: string,refreshToken: string, profile: any,
        done: VerifyCallback): Promise<any>{
        const{id,name,emails,photos,phoneNumbers} = profile;
        const user = {
            googleId: id,
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            phoneNumber: '+840919469733',
            accessToken
        };
        done(null,user);
    }
}
