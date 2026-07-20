#include <bits/stdc++.h>
using namespace std;

map<int, int> modInverse = {
    {1,1}, {3,9}, {5,21}, {7,15}, {9,3},
    {11,19}, {15,7}, {17,23}, {19,11},
    {21,5}, {23,17}, {25,25}
};


int det2x2(vector<vector<int>>& k) {
    return (k[0][0] * k[1][1] - k[0][1] * k[1][0]) % 26;
}

vector<vector<int>> inverse2x2(vector<vector<int>>& k) {

    int det = det2x2(k);
    if (det < 0) det += 26;

    int invDet = modInverse[det];

    vector<vector<int>> inv(2, vector<int>(2));

    inv[0][0] = (k[1][1] * invDet) % 26;
    inv[0][1] = ((-k[0][1] + 26) * invDet) % 26;
    inv[1][0] = ((-k[1][0] + 26) * invDet) % 26;
    inv[1][1] = (k[0][0] * invDet) % 26;

    return inv;
}

int det3x3(vector<vector<int>>& k) {

    int det =
        k[0][0] * (k[1][1] * k[2][2] - k[1][2] * k[2][1])
      - k[0][1] * (k[1][0] * k[2][2] - k[1][2] * k[2][0])
      + k[0][2] * (k[1][0] * k[2][1] - k[1][1] * k[2][0]);

    det %= 26;
    if (det < 0) det += 26;

    return det;
}

vector<vector<int>> inverse3x3(vector<vector<int>>& k) {

    int det = det3x3(k);
    int invDet = modInverse[det];

    vector<vector<int>> adj(3, vector<int>(3));

    adj[0][0] =  (k[1][1]*k[2][2] - k[1][2]*k[2][1]);
    adj[0][1] = -(k[1][0]*k[2][2] - k[1][2]*k[2][0]);
    adj[0][2] =  (k[1][0]*k[2][1] - k[1][1]*k[2][0]);

    adj[1][0] = -(k[0][1]*k[2][2] - k[0][2]*k[2][1]);
    adj[1][1] =  (k[0][0]*k[2][2] - k[0][2]*k[2][0]);
    adj[1][2] = -(k[0][0]*k[2][1] - k[0][1]*k[2][0]);

    adj[2][0] =  (k[0][1]*k[1][2] - k[0][2]*k[1][1]);
    adj[2][1] = -(k[0][0]*k[1][2] - k[0][2]*k[1][0]);
    adj[2][2] =  (k[0][0]*k[1][1] - k[0][1]*k[1][0]);

    
    vector<vector<int>> inv(3, vector<int>(3));

    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {

            int value = adj[j][i];

            value %= 26;
            if (value < 0) value += 26;

            inv[i][j] = (value * invDet) % 26;
        }
    }

    return inv;
}

string decrypt(string cipher, vector<vector<int>>& key) {

    int n = key.size();

    vector<vector<int>> invKey;

    if (n == 2)
        invKey = inverse2x2(key);
    else
        invKey = inverse3x3(key);

    string plain = "";

    for (int i = 0; i < cipher.size(); i += n) {

        vector<int> block(n);

        for (int j = 0; j < n; j++)
            block[j] = cipher[i + j] - 'A';

        for (int row = 0; row < n; row++) {

            int sum = 0;

            for (int col = 0; col < n; col++) {
                sum += invKey[row][col] * block[col];
            }

            sum %= 26;
            plain += char(sum + 'A');
        }
    }

    return plain;
}

int main() {

    
    string cipher = "HIAT";

    vector<vector<int>> key = {
        {3, 3},
        {2, 5}
    };

    cout << decrypt(cipher, key) << endl;

    
    string cipher2 = "POH";

    vector<vector<int>> key2 = {
        {6,24,1},
        {13,16,10},
        {20,17,15}
    };
   

    cout << decrypt(cipher2, key2) << endl;
     string cipher3="AVBHKIYYCKWSXWGEXIFRHIKYDAESNNTQHBLPXTFTQLXJTLJZVXAVHRFTNGRNHIWD";
         cout << decrypt(cipher3, key) << endl;
     
    

    return 0;
}