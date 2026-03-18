# Remove All Messages from Facebook Messenger

A free, open-source browser console script that automatically deletes all conversations from [messenger.com](https://www.messenger.com). Most extensions that do this are paid — this script is completely free.

---

## ⚠️ Warning

- **This action is irreversible.** Deleted conversations cannot be recovered.
- Use this script only if you are sure you want to permanently remove all your Messenger conversations.
- Facebook's UI may change over time, which could require updates to the selectors in the script.

---

## How to Use

### Step 1 — Open Messenger

Go to [https://www.messenger.com](https://www.messenger.com) in your browser and log in to your Facebook account.

### Step 2 — Open the Browser Console

Open the Developer Tools console in your browser:

| Browser | Shortcut |
|---------|----------|
| Chrome / Edge | `F12` or `Ctrl + Shift + J` (Windows/Linux) / `Cmd + Option + J` (Mac) |
| Firefox | `F12` or `Ctrl + Shift + K` (Windows/Linux) / `Cmd + Option + K` (Mac) |
| Safari | `Cmd + Option + C` (Mac) — enable Developer menu first in Preferences |

Make sure you are on the **Console** tab.

### Step 3 — Paste and Run the Script

Copy the entire contents of [`deleteAllConversations.js`](./deleteAllConversations.js), paste it into the console, and press **Enter**.

```js
(async function deleteAllConversations() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let count = 0;

  async function deleteNext() {
    const btn = document.querySelector('[aria-controls="thread-list-menu-buttons"]');

    if (!btn) {
      console.log(`Done! Deleted ${count} conversations.`);
      return;
    }

    btn.click();
    await delay(900);

    const menuItems = [...document.querySelectorAll('[role="menuitem"]')];
    const deleteItem = menuItems.find(el =>
      el.textContent.trim().toLowerCase().startsWith('delete')
    );

    if (!deleteItem) {
      console.warn("Delete option not found in menu, skipping...");
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await delay(600);
      await deleteNext();
      return;
    }

    deleteItem.click();
    await delay(900);

    const allBtns = [...document.querySelectorAll('[role="button"], button')];
    const confirmBtn = allBtns.find(el => {
      const t = el.textContent.trim();
      return t === 'Delete' || t === 'Delete Chat' || t === 'Delete conversation';
    });

    if (confirmBtn) {
      confirmBtn.click();
      count++;
      console.log(`Deleted conversation #${count}`);
      await delay(1500);
      await deleteNext();
    } else {
      console.warn("Confirm button not found, pressing Escape...");
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      await delay(600);
      await deleteNext();
    }
  }

  console.log("Starting...");
  await deleteNext();
})();
```

### Step 4 — Wait for Completion

The script will run automatically and log progress to the console:

```
Starting...
Deleted conversation #1
Deleted conversation #2
...
Done! Deleted 42 conversations.
```

Do **not** close the tab or navigate away while the script is running.

---

## How It Works

1. The script finds the first conversation's three-dot (⋯) menu button in the sidebar.
2. It clicks the button to open the dropdown.
3. It selects the **Delete** option from the menu.
4. It clicks the **Delete** confirmation button in the dialog that appears.
5. It repeats this process for every conversation until none remain.
6. To stop: Run location.reload() in the console or reload the tab

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Script says `Delete option not found in menu` | Facebook may have changed its UI. Try refreshing the page and running the script again. |
| Script stops before all conversations are deleted | Re-run the script; it will continue from where it left off. |
| Nothing happens after pasting | Make sure you are on `messenger.com` and are logged in. Some browsers block console scripts — try a different browser. |
| Chrome shows "paste blocked" warning | Type `allow pasting` into the console first, then paste the script. |

---

## Contributing

Pull requests are welcome! If Facebook updates its UI and the selectors break, feel free to open an issue or submit a fix.

---

## License

This project is released as free and open-source software. Use it at your own risk.
