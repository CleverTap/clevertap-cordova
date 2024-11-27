let currentTemplateName = null;
let currentFunctionName = null;
function showTemplateModal(title, description) {
  currentTemplateName = title;
  document.getElementById('modalTitle').innerText = title;
  document.getElementById('modalDescription').innerText = description;
  document.getElementById('templatePopupModal').style.display = 'block';

  actionArgInput.style.display = 'block';
  triggerActionBtn.style.display = 'block';
}

function showFunctionModal(title, description) {
  currentFunctionName = title;
  document.getElementById('functionModalTitle').innerText = title;
  document.getElementById('functionModalDescription').innerText = description;
  document.getElementById('functionPopupModal').style.display = 'block';
}

// Hide the modal
function dismissTemplateModal() {
  CleverTap.customTemplateSetDismissed(currentTemplateName);
  document.getElementById('templatePopupModal').style.display = 'none';
}

function closeFunctionModal() {
  console.log(currentFunctionName);
  CleverTap.customTemplateSetDismissed(currentFunctionName);
  document.getElementById('functionPopupModal').style.display = 'none';
}

// Event Listeners
document.getElementById('templateDismissBtn').addEventListener('click', dismissTemplateModal);
document.getElementById('functionCloseBtn').addEventListener('click', closeFunctionModal);

document.getElementById('setPresentedBtn').addEventListener('click', () => {
  CleverTap.customTemplateSetPresented(currentTemplateName);
});

document.getElementById('openTemplateFileBtn').addEventListener('click', () => {
   const fileName = document.getElementById('templateFileArgInput').value;
   CleverTap.customTemplateGetFileArg(currentTemplateName, fileName).then((filePath) => {
    showToast(filePath);
  });
});

document.getElementById('openFunctionFileBtn').addEventListener('click', () => {
  const fileName = document.getElementById('functionFileArgInput').value;
  CleverTap.customTemplateGetFileArg(currentFunctionName, fileName).then((filePath) => {
    showToast(filePath);
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
            showTemplateModal(param.name, description)
        })
    }
);

document.addEventListener(
  'CleverTapCustomFunctionPresent',
  param => {
      CleverTap.customTemplateContextToString(param.name).then((str) => {
          let description = `Arguments for "${param.name}":${str}`;
          showFunctionModal(param.name, description)
      })
  }
);
