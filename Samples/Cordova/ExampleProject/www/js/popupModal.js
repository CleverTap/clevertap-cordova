// Show the modal
let currentTemplateName = null;
function showModal(title, description) {
  currentTemplateName = title;
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalDescription').innerText = description;
  document.getElementById('popupModal').style.display = 'block';
}

// Hide the modal
function dismissModal() {
    CleverTap.customTemplateSetDismissed(currentTemplateName);
  document.getElementById('popupModal').style.display = 'none';
}

// Event Listeners
document.getElementById('dismissBtn').addEventListener('click', dismissModal);
document.getElementById('setPresentedBtn').addEventListener('click', () => {
  CleverTap.customTemplateSetPresented(currentTemplateName);
});

document.getElementById('openFileBtn').addEventListener('click', () => {
  console.log('Open File clicked');
});

document.getElementById('triggerActionBtn').addEventListener('click', () => {
  const actionArg = document.getElementById('actionArgInput').value;
  console.log(`Trigger Action with arg: ${actionArg}`);
});

document.addEventListener(
    'CleverTapCustomTemplatePresent',
    param => {
        CleverTap.customTemplateContextToString(param.name).then((str) => {
            let description = `Arguments for "${param.name}":${str}`;
            showModal(param.name, description)
        })
    }
);
