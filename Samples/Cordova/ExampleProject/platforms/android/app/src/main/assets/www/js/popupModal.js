// Show the modal
let currentTemplateName = null;
function showModal(title, description, isFunction) {
  currentTemplateName = title;
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalDescription').innerText = description;
  document.getElementById('popupModal').style.display = 'block';

  if (!isFunction) {
    actionArgInput.style.display = 'block';  // Show the input
    triggerActionBtn.style.display = 'block'; // Show the button
  } else {
    actionArgInput.style.display = 'none';   // Hide the input
    triggerActionBtn.style.display = 'none'; // Hide the button
  }
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
   const fileName = document.getElementById('fileArgInput').value;
   CleverTap.customTemplateGetFileArg(currentTemplateName, fileName).then((filePath) => {
   console.log(filePath);
  });
});

document.getElementById('triggerActionBtn').addEventListener('click', () => {
  const actionName = document.getElementById('actionArgInput').value;
  CleverTap.customTemplateRunAction(currentTemplateName, actionName);
});

document.addEventListener(
    'CleverTapCustomTemplatePresent',
    param => {
        CleverTap.customTemplateContextToString(param.name).then((str) => {
            let description = `Arguments for "${param.name}":${str}`;
            showModal(param.name, description, false)
        })
    }
);

document.addEventListener(
  'CleverTapCustomFunctionPresent',
  param => {
      CleverTap.customTemplateContextToString(param.name).then((str) => {
          let description = `Arguments for "${param.name}":${str}`;
          showModal(param.name, description, true)
      })
  }
);
