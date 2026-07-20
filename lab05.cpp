#include <bits/stdc++.h>
using namespace std;

using ll = long long;

ll modPow(ll base, ll exp, ll mod) {
    ll result = 1;
    base %= mod;

    while (exp > 0) {
        if (exp & 1)
            result = (__int128)result * base % mod;

        base = (__int128)base * base % mod;
        exp >>= 1;
    }

    return result;
}

ll extendedGCD(ll a, ll b, ll &x, ll &y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }

    ll x1, y1;
    ll gcd = extendedGCD(b, a % b, x1, y1);

    x = y1;
    y = x1 - y1 * (a / b);

    return gcd;
}


ll modInverse(ll a, ll mod) {
    ll x, y;
    ll gcd = extendedGCD(a, mod, x, y);

    if (gcd != 1)
        return -1;

    return (x % mod + mod) % mod;
}

int main() {

    ll n = 670726081;
    ll d = 12345;

    
    ll p = -1, q = -1;

    for (ll i = 2; i * i <= n; i++) {
        if (n % i == 0) {
            p = i;
            q = n / i;
            break;
        }
    }

    cout << "p = " << p << endl;
    cout << "q = " << q << endl;

    
    ll phi = (p - 1) * (q - 1);

    cout << "phi(n) = " << phi << endl;


    ll e = modInverse(d, phi);

    cout << "e = " << e << endl;

    
    string pt =
    "thegranddesignbreaksthenewsbittertosomethattocreateauniversefromabsolutenothinggodisnotnecessaryallthatisneededarethelawsofnaturethatistherecanhavebeenabigbangcreationwithoutthehelpofgodprovidedthelawsofnaturepredatetheuniverseourconceptoftimebeginswiththecreationoftheuniversethereforeifthelawsofnaturecreatedtheuniversetheselawsmusthaveexistedpriortotimethatisthelawsofnaturewouldbeoutsideoftimewhatwehavethenistotallynonphysicallawsoutsideoftimecreatingauniversenowthatdescriptionmightsoundsomewhatfamiliarverymuchlikethebiblicalconceptofgodnotphysicaloutsideoftimeabletocreateuniverse";

    vector<ll> cipher;

    
    for (char ch : pt) {
        ll m = ch - 'a' + 1; 
        ll c = modPow(m, e, n);
        cipher.push_back(c);
    }

    cout << "\nEncrypted Ciphertext:\n";
    for (ll x : cipher)
        cout << x << " ";

    cout << "\n\nDecrypted Text:\n";


    string decrypted = "";

    for (ll c : cipher) {
        ll m = modPow(c, d, n);
        decrypted += char(m - 1 + 'a');
    }

    cout << decrypted << endl;

    return 0;
}