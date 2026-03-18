(async function deleteAllConversations() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let count = 0;

  async function deleteNext() {
    // Use the real selector from your DOM
    const btn = document.querySelector('[aria-controls="thread-list-menu-buttons"]');

    if (!btn) {
      console.log(`Done! Deleted ${count} conversations.`);
      return;
    }

    // Click the 3-dot button
    btn.click();
    await delay(900);

    // Find "Delete" in the dropdown menu
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

    // Find the confirm "Delete" button in the dialog
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
