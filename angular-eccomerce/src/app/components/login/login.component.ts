import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    ngOnInit(): void {
        if (typeof window !== 'undefined') {
            import('@okta/okta-signin-widget')
                .then(module => {
                    const OktaSignIn = module.default;
                    const oktaSignIn = new OktaSignIn({
                        baseUrl: 'https://{yourOktaDomain}',
                        clientId: '{clientId}',
                        redirectUri: 'http://localhost:4200/login/callback'
                    });

                    oktaSignIn.renderEl(
                        { el: '#okta-login-container' },
                        function (res: any) {
                            if (res.status === 'SUCCESS') {
                                res.session.setCookieAndRedirect('http://localhost:4200');
                            }
                        }
                    );
                })
                .catch(err => console.error('Failed to load Okta SignIn widget:', err));
        }
    }
}
