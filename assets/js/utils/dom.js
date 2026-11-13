export function createElement(tagName, { className = "", text = "", attributes = {} } = {}) {
  const element = document.createElement(tagName);

  if (className) element.className = className;
  if (text) element.textContent = text;

  for (const [name, value] of Object.entries(attributes)) {
    if (value !== undefined && value !== null) element.setAttribute(name, String(value));
  }

  return element;
}

export function appendText(parent, tagName, text, className = "") {
  const element = createElement(tagName, { className, text });
  parent.append(element);
  return element;
}
