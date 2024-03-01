const editable = document.getElementsByTagName("body")[0];
var elementAddress = "";
var elementEndOffset = 0;
//editable.innerHTML = ""; // preLoadText;

const editorDiv = document.getElementById("editor");
const colors = {
  1: "antiquewhite",
  2: "blueviolet",
  3: "khaki",
  4: "aquamarine",
};
// You can also save the edited content when needed
// function saveContent() {
//   const editedContent = editorDiv.innerHTML;
//   // You can send 'editedContent' to a server or store it locally as needed.
// }
// function getCaretCoordinates() {
//   let x = 0,
//     y = 0;
//   const isSupported = typeof window.getSelection !== "undefined";
//   if (isSupported) {
//     const selection = window.getSelection();
//     // Check if there is a selection (i.e. cursor in place)
//     if (selection.rangeCount !== 0) {
//       // Clone the range
//       const range = selection.getRangeAt(0).cloneRange();
//       // Collapse the range to the start, so there are not multiple chars selected
//       range.collapse(true);
//       // getCientRects returns all the positioning information we need
//       const rect = range.getClientRects()[0];
//       if (rect) {
//         x = rect.left; // since the caret is only 1px wide, left == right
//         y = rect.top; // top edge of the caret
//       }
//     }
//   }
//   return { x, y };
// }
var textNodeColl = [];
function InsertElementUsingRange(path, endOffset) {
  // path = "ul:eq(0)>li:eq(0)>a:eq(0)";
  const range = document.createRange();
  $(".dynamic-caret-parent").remove();
  const spanEle = $(
    '<span class="dynamic-caret-parent">&NoBreak;<span class="dynamic-caret"></span>&NoBreak;</span>'
  ); //document.createElement("span");
  // $(".dynamic-caret-parent").remove();
  textNodeColl = [];
  getTextNode($(path)[0]);
  console.log(textNodeColl);

  if (textNodeColl[0].length >= endOffset) {
    range.setStart(textNodeColl[0], 0);
    range.setEnd(textNodeColl[0], endOffset);
  } else {
    let tempindex = 1;
    let offset = endOffset - textNodeColl[0].length;
    let finalIndex = 0;
    for (index = tempindex; index < textNodeColl.length; index++) {
      const element = textNodeColl[index];
      finalIndex = index;
      if (element.length >= offset) break;
      offset = offset - element.length;
    }
    range.setStart(textNodeColl[0], 0);
    range.setEnd(textNodeColl[finalIndex], offset);
  }

  range.collapse(false);

  range.insertNode(spanEle[0]);
}

function getTextNode(element) {
  if (element.nodeType === 3) textNodeColl.push(element); //return element;

  element.childNodes.forEach((element) => {
    getTextNode(element);
  });
}

function getSelectionContentCount() {
  let position = 0;
  const isSupported = typeof window.getSelection !== "undefined";
  if (isSupported) {
    const selection = window.getSelection();
    // Check if there is a selection (i.e. cursor in place)
    if (selection.rangeCount !== 0) {
      // Store the original range
      const range = window.getSelection().getRangeAt(0);
      // Clone the range
      const preCaretRange = range.cloneRange();
      // Select all textual contents from the contenteditable element
      preCaretRange.selectNodeContents(selection.anchorNode.parentNode);
      // And set the range end to the original clicked position
      preCaretRange.setEnd(range.endContainer, range.endOffset);

      // Return the text length from contenteditable start to the range end
      position = preCaretRange.toString().length;
      let value = preCaretRange.toString();
      // elementEndOffset = position;
    }
  }
  return position;
}

// function toggleTooltip(event, contenteditable) {
//   const tooltip = document.getElementById("tooltip");

//   if (contenteditable.contains(event.target)) {
//     const { x, y } = getCaretCoordinates();
//     tooltip.setAttribute("aria-hidden", "false");
//     tooltip.setAttribute(
//       "style",
//       `display: inline-block; left: ${x - 32}px; top: ${y - 36}px`
//     );
//   } else {
//     tooltip.setAttribute("aria-hidden", "true");
//     tooltip.setAttribute("style", "display: none;");
//   }
// }

function updateIndex(event, element) {
  const textPosition = document.getElementById("caretIndex");
  if (element.contains(event.target)) {
    textPosition.innerText = getCaretIndex(element).toString();
  } else {
    textPosition.innerText = "–";
  }
}

function getElementAddress(e, element) {
  // if (element.contains(e.target)) {
  //debugger;

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);
  //debugger;
  var selectedElement = printElementAddress(selection.anchorNode, range);
  elementAddress = selectedElement; // [...selectedElement].reverse().join(">");
  //var anchorOffset = selection.anchorOffset;
  //elementAddress = reverseElementAddress;
  elementEndOffset = getSelectionContentCount();

  let positionObj = {
    userName: userName,
    address: elementAddress,
    offset: elementEndOffset,
  };

  broatcastCaretPosition(positionObj);
  // InsertElementUsingRange(elementAddress, elementEndOffset);
  // console.log(reverseElementAddress);
  //console.log(anchorOffset);
  // insertDummyCaret({ reverseElementAddress, anchorOffset });
  // }
}
function highligher(range, colorId) {
  var startNode = range.startContainer;

  if (range.startOffset >= 1)
    startNode = range.startContainer.splitText(range.startOffset);

  var endNode = range.endContainer;

  if (range.endContainer.length !== range.endOffset)
    range.endContainer.splitText(range.endOffset);

  var leaf = false;
  var id = generateID();
  while (true) {
    if (startNode.nodeType === 3) {
      //textNode
      console.log(startNode);
      var marker = createHighlighter(id, colorId);
      startNode.parentNode.insertBefore(marker, startNode);
      marker.appendChild(startNode);
    }
    if (startNode === endNode) break;
    if (leaf && startNode.hasChildNodes()) {
      startNode = startNode.firstChild;
    } else if (startNode.nextSibling) {
      startNode = startNode.nextSibling;
      leaf = true;
    } else if (!startNode.nextSibling) {
      startNode = startNode.parentNode;
      leaf = false;
    }
  }
}
function createHighlighter(id, colorId) {
  var element = document.createElement("marker");
  element.id = id;
  element.setAttribute("highlightid", id);
  element.setAttribute("highlighter-color-id", colorId);
  element.style.cursor = "pointer";
  element.style.backgroundColor = colors[colorId]; //"rgb(209, 255, 97)";
  return element;
}

function printElementAddress(node, range) {
  //debugger;

  let address = [];
  let parent = node.parentNode;
  while (
    typeof parent !== "undefined" &&
    parent !== null &&
    !isEditor(parent)
  ) {
    address.push(`${getNodePoistion(parent)}`);
    parent = parent.parentNode;
  }
  return [...address].reverse().join(">");
}
function getNodePoistion(node) {
  var { nodeName, previousElementSibling } = node;
  //  let perviousNode=node.previousElementSibling;
  let count = 0;
  while (
    typeof previousElementSibling !== "undefined" &&
    previousElementSibling !== null &&
    !isEditor(previousElementSibling)
  ) {
    if (previousElementSibling.nodeName === nodeName) count += 1;
    previousElementSibling = previousElementSibling.previousElementSibling;
  }

  if (count === 0) return `${nodeName.toLowerCase()}:eq(0)`;

  return `${nodeName.toLowerCase()}:eq(${count})`;
}

function isEditor(node) {
  return editable.isSameNode(node);
}
function getSelectedTextNodes(selection) {
  const textNodes = [];
  for (let i = 0; i < selection.rangeCount; i++) {
    const range = selection.getRangeAt(i);
    let currentNode = range.commonAncestorContainer;
    while (currentNode) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        textNodes.push(currentNode);
      }
      currentNode = currentNode.parentNode;
    }
  }
  return textNodes;
}
function getSelectionAddress() {
  //if (element.contains(e.target) && !window.getSelection().isCollapsed) {
  // debugger;

  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  if (!selection.isCollapsed) highligher(range);
  // getSelectedTextNodes(selection);
  let startNodeAddress = printElementAddress(selection.anchorNode, range);
  let endNodeAddress = printElementAddress(selection.focusNode, range);
  console.log({ startNodeAddress, endNodeAddress });
  //debugger;
  // }
}
function generateID() {
  const characters = "abcdefghijklmnopqrstuvwxyz123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function addDarkness(e) {
  if (e.target.localName !== "marker") return;
  // debugger;
  let id = e.target.id;
  $(`marker[highlightid=${id}]`).css("filter", "brightness(90%)");

  //console.log(e);
}
function removeDarkness(e) {
  if (e.target.localName !== "marker") return;
  // debugger;
  let id = e.target.id;
  $(`marker[highlightid=${id}]`).css("filter", "brightness(100%)");

  //console.log(e);
}
// function getCaretPosition() {
//   const selection = window.getSelection();
//   const range = selection.getRangeAt(0);

//   // Check if the selection is collapsed (caret is at the starting position)
//   if (range.collapsed) {
//     const caretOffset = range.startOffset;
//     const caretNode = range.startContainer;
//     const rect = caretNode.getBoundingClientRect();

//     // Calculate the X coordinate based on the caret offset within the node
//     const x = rect.left + caretNode.getClientRects()[0].width * caretOffset;

//     caretPosition.textContent = `Caret Position - X: ${x}, Y: ${rect.top}`;
//   } else {
//     const rect = range.getBoundingClientRect();
//     caretPosition.textContent = `Caret Position - X: ${rect.left}, Y: ${rect.top}`;
//   }
// }

$("#id-but").click(function () {
  InsertElementUsingRange(elementAddress, elementEndOffset);
});
function openHighligherBox(obj) {
  //debugger;
  obj.stopPropagation();

  var container = $("#marker-box");
  if (container.is(obj.target) || container.has(obj.target).length >= 1) {
    container.hide();
    return false;
  }

  const selection = window.getSelection();
  $("#marker-box").hide();
  $("#marker-box div").removeClass("x-mark");
  if (selection.isCollapsed) return false;
  $("#marker-box")
    .css("top", `${obj.y}px`)
    .css("left", `${obj.x - 55}px`)
    .show();
}
function editHighlighter(e) {
  console.log(
    `%c ${e.target.localName}`,
    "background:antiquewhite;padding:4px;border-radius:2px"
  );
  $("div").removeClass("x-mark");
  if (e.target.localName !== "marker") return false;

  var colorId = $(e.target).attr("highlighter-color-id");
  console.log(
    `%c ${colorId}`,
    "background:antiquewhite;padding:4px;border-radius:2px"
  );
  $(`div [data-color-id=${colorId}]`).addClass("x-mark");
  $("#marker-box")
    .css("top", `${e.y}px`)
    .css("left", `${e.x - 55}px`)
    .show();
}

function setHighlight(color) {
  const selection = window.getSelection();
  const range = selection.getRangeAt(0);

  if (!selection.isCollapsed) highligher(range, color);
  // debugger;
  range.collapse();
}

function removeHighlight(highLightId) {
  var marker = $(`marker[highlightid=${highLightId}]`);

  for (let index = 0; index < marker.length; index++) {
    let element = marker[index];

    element.parentNode.insertBefore(element.childNodes[0], element);
    element.remove();
    //$('marker[highlightid="zuljlpqqgslebgi"]')[0].parentNode.insertBefore($('marker[highlightid="zuljlpqqgslebgi"]')[0].childNodes[0],$('marker[highlightid="zuljlpqqgslebgi"]')[0])
  }
}

document.addEventListener("click", (e) => editHighlighter(e));
//document.addEventListener("click", (e) => updateIndex(e, editable));
//document.addEventListener("click", (e) => getElementAddress(e, null));
//document.addEventListener("keyup", (e) => getElementAddress(e, null));
document.addEventListener("mouseup", (e) => openHighligherBox(e));
document.addEventListener("mouseover", (e) => addDarkness(e));
document.addEventListener("mouseout", (e) => removeDarkness(e));
//document.addEventListener("keyup", (e) => updateIndex(e, editable));
//document.addEventListener("click", (e) => getCaretPosition());
//document.addEventListener("keyup", (e) => getCaretPosition());
