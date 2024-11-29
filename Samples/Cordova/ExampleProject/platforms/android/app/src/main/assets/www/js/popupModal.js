let currentTemplateName = null;
let currentFunctionName = null;
function showTemplateModal(title, description) {
  currentTemplateName = title;
  document.getElementById("modalTitle").innerText = title;
  document.getElementById("modalDescription").innerText = description;
  document.getElementById("templatePopupModal").style.display = "block";

  actionArgInput.style.display = "block";
  triggerActionBtn.style.display = "block";
}

function showFunctionModal(title, description) {
  currentFunctionName = title;
  document.getElementById("functionModalTitle").innerText = title;
  document.getElementById("functionModalDescription").innerText = description;
  document.getElementById("functionPopupModal").style.display = "block";
}

// Hide the modal
function dismissTemplateModal() {
  CleverTap.customTemplateSetDismissed(currentTemplateName);
  document.getElementById("templatePopupModal").style.display = "none";
}

function closeFunctionModal() {
  console.log(currentFunctionName);
  CleverTap.customTemplateSetDismissed(currentFunctionName);
  document.getElementById("functionPopupModal").style.display = "none";
}

function handleArgType(argType, currentTemplateName, fileName) {
  const argMethods = {
      string: CleverTap.customTemplateGetStringArg,
      number: CleverTap.customTemplateGetNumberArg,
      object: CleverTap.customTemplateGetObjectArg,
      boolean: CleverTap.customTemplateGetBooleanArg,
      file: CleverTap.customTemplateGetFileArg,
  };

  const selectedMethod = argMethods[argType];

  if (selectedMethod) {
      selectedMethod(currentTemplateName, fileName)
          .then((value) => showToast(value))
          .catch((error) => showToast(error));
  } else {
      showToast("Unexpected Type");
  }
}


// Event Listeners
document
  .getElementById("templateDismissBtn")
  .addEventListener("click", dismissTemplateModal);
document
  .getElementById("functionCloseBtn")
  .addEventListener("click", closeFunctionModal);

document.getElementById("setPresentedBtn").addEventListener("click", () => {
  CleverTap.customTemplateSetPresented(currentTemplateName);
});

document.getElementById("printTemplateArgBtn").addEventListener("click", () => {

  const argType = document.getElementById("typeSelector").value;
  const argName = document.getElementById("templateArgInput").value;
  handleArgType(argType, currentTemplateName, argName);
});

document.getElementById("openFunctionFileBtn").addEventListener("click", () => {
  const fileName = document.getElementById("functionFileArgInput").value;
  CleverTap.customTemplateGetFileArg(currentFunctionName, fileName).then(
    (filePath) => {
      showToast(filePath);
    }
  );
});

document.getElementById("triggerActionBtn").addEventListener("click", () => {
  const actionName = document.getElementById("actionArgInput").value;
  CleverTap.customTemplateRunAction(currentTemplateName, actionName);
});

document.addEventListener("CleverTapCustomTemplatePresent", (param) => {
  CleverTap.customTemplateContextToString(param.name).then((str) => {
    let description = `Arguments for "${param.name}":${str}`;
    showTemplateModal(param.name, description);
  });
});

document.addEventListener("CleverTapCustomFunctionPresent", (param) => {
  CleverTap.customTemplateContextToString(param.name).then((str) => {
    let description = `Arguments for "${param.name}":${str}`;
    showFunctionModal(param.name, description);
  });
});
