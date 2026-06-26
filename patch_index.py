import os, re

with open('public/index.html', 'r', encoding='utf-8') as f:
    code = f.read()

# Change default provider
code = code.replace("var loginProvider = 'netease';", "var loginProvider = 'spotify';")
code = code.replace("var activeAccountProvider = 'netease';", "var activeAccountProvider = 'spotify';")

old_func = '''async function showLoginModal(opts) {
    opts = opts || {};
    if (opts.provider) loginProvider = opts.provider === 'qq' ? 'qq' : 'netease';
    var modal = document.getElementById('login-modal');
    openGsapModal(modal);
    updateLoginProviderUi();
    await refreshQr();
  }'''

new_func = '''async function showLoginModal(opts) {
    try {
      var creds = await apiJson('/api/spotify/credentials');
      var clientId = creds && creds.credentials && creds.credentials.clientId;
      if (!clientId) {
        openGsapModal(document.getElementById('spotify-info-modal'));
        return;
      }
    } catch(e) {}
    openProviderLogin('spotify');
  }'''

if old_func in code:
    code = code.replace(old_func, new_func)
    print('showLoginModal replaced.')
else:
    print('Could not find showLoginModal exact match.')

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(code)
