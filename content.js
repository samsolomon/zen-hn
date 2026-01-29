const PHOSPHOR_SVGS = {
  "arrow-fat-up":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M229.66,114.34l-96-96a8,8,0,0,0-11.32,0l-96,96A8,8,0,0,0,32,128H72v80a16,16,0,0,0,16,16h80a16,16,0,0,0,16-16V128h40a8,8,0,0,0,5.66-13.66ZM176,112a8,8,0,0,0-8,8v88H88V120a8,8,0,0,0-8-8H51.31L128,35.31,204.69,112Z\"/></svg>",
  "arrow-fat-down":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M231.39,132.94A8,8,0,0,0,224,128H184V48a16,16,0,0,0-16-16H88A16,16,0,0,0,72,48v80H32a8,8,0,0,0-5.66,13.66l96,96a8,8,0,0,0,11.32,0l96-96A8,8,0,0,0,231.39,132.94ZM128,220.69,51.31,144H80a8,8,0,0,0,8-8V48h80v88a8,8,0,0,0,8,8h28.69Z\"/></svg>",
  "bookmark-simple":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M184,32H72A16,16,0,0,0,56,48V224a8,8,0,0,0,12.24,6.78L128,193.43l59.77,37.35A8,8,0,0,0,200,224V48A16,16,0,0,0,184,32Zm0,177.57-51.77-32.35a8,8,0,0,0-8.48,0L72,209.57V48H184Z\"/></svg>",
  "share-fat":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M237.66,106.35l-80-80A8,8,0,0,0,144,32V72.35c-25.94,2.22-54.59,14.92-78.16,34.91-28.38,24.08-46.05,55.11-49.76,87.37a12,12,0,0,0,20.68,9.58h0c11-11.71,50.14-48.74,107.24-52V192a8,8,0,0,0,13.66,5.65l80-80A8,8,0,0,0,237.66,106.35ZM160,172.69V144a8,8,0,0,0-8-8c-28.08,0-55.43,7.33-81.29,21.8a196.17,196.17,0,0,0-36.57,26.52c5.8-23.84,20.42-46.51,42.05-64.86C99.41,99.77,127.75,88,152,88a8,8,0,0,0,8-8V51.32L220.69,112Z\"/></svg>",
  "link-simple":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M165.66,90.34a8,8,0,0,1,0,11.32l-64,64a8,8,0,0,1-11.32-11.32l64-64A8,8,0,0,1,165.66,90.34ZM215.6,40.4a56,56,0,0,0-79.2,0L106.34,70.45a8,8,0,0,0,11.32,11.32l30.06-30a40,40,0,0,1,56.57,56.56l-30.07,30.06a8,8,0,0,0,11.31,11.32L215.6,119.6a56,56,0,0,0,0-79.2ZM138.34,174.22l-30.06,30.06a40,40,0,1,1-56.56-56.57l30.05-30.05a8,8,0,0,0-11.32-11.32L40.4,136.4a56,56,0,0,0,79.2,79.2l30.06-30.07a8,8,0,0,0-11.32-11.31Z\"/></svg>",
  "check-circle":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,24A104,104,0,1,0,232,128,104.12,104.12,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm45.66-109.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,145.37l50.34-50.34a8,8,0,0,1,11.32,11.32Z\"/></svg>",
  "caret-down":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z\"/></svg>",
  "dots-three":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,104a24,24,0,1,0,24,24A24,24,0,0,0,128,104Zm-64,0a24,24,0,1,0,24,24A24,24,0,0,0,64,104Zm128,0a24,24,0,1,0,24,24A24,24,0,0,0,192,104Z\"/></svg>",
  "circle-wavy":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.57-1.47-7.63-5.37-11.57-9.14C146.27,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.57-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.73,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.14-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.14,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.14,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.14,214.31,142.11Z\"/></svg>",
  "seal":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M225.86,102.82c-3.77-3.94-7.67-8-9.14-11.57-1.36-3.27-1.44-8.69-1.52-13.94-.15-9.76-.31-20.82-8-28.51s-18.75-7.85-28.51-8c-5.25-.08-10.67-.16-13.94-1.52-3.57-1.47-7.63-5.37-11.57-9.14C146.27,23.51,138.44,16,128,16s-18.27,7.51-25.18,14.14c-3.94,3.77-8,7.67-11.57,9.14C88,40.64,82.56,40.72,77.31,40.8c-9.76.15-20.82.31-28.51,8S41,67.55,40.8,77.31c-.08,5.25-.16,10.67-1.52,13.94-1.47,3.57-5.37,7.63-9.14,11.57C23.51,109.72,16,117.56,16,128s7.51,18.27,14.14,25.18c3.77,3.94,7.67,8,9.14,11.57,1.36,3.27,1.44,8.69,1.52,13.94.15,9.76.31,20.82,8,28.51s18.75,7.85,28.51,8c5.25.08,10.67.16,13.94,1.52,3.56,1.47,7.63,5.37,11.57,9.14C109.73,232.49,117.56,240,128,240s18.27-7.51,25.18-14.14c3.94-3.77,8-7.67,11.57-9.14,3.27-1.36,8.69-1.44,13.94-1.52,9.76-.15,20.82-.31,28.51-8s7.85-18.75,8-28.51c.08-5.25.16-10.67,1.52-13.94,1.47-3.56,5.37-7.63,9.14-11.57C232.49,146.28,240,138.44,240,128S232.49,109.73,225.86,102.82Zm-11.55,39.29c-4.79,5-9.75,10.17-12.38,16.52-2.52,6.1-2.63,13.07-2.73,19.82-.1,7-.21,14.33-3.32,17.43s-10.39,3.22-17.43,3.32c-6.75.1-13.72.21-19.82,2.73-6.35,2.63-11.52,7.59-16.52,12.38S132,224,128,224s-9.14-4.92-14.11-9.69-10.17-9.75-16.52-12.38c-6.1-2.52-13.07-2.63-19.82-2.73-7-.1-14.33-.21-17.43-3.32s-3.22-10.39-3.32-17.43c-.1-6.75-.21-13.72-2.73-19.82-2.63-6.35-7.59-11.52-12.38-16.52S32,132,32,128s4.92-9.14,9.69-14.11,9.75-10.17,12.38-16.52c2.52-6.1,2.63-13.07,2.73-19.82.1-7,.21-14.33,3.32-17.43S70.51,56.9,77.55,56.8c6.75-.1,13.72-.21,19.82-2.73,6.35-2.63,11.52-7.59,16.52-12.38S124,32,128,32s9.14,4.92,14.11,9.69,10.17,9.75,16.52,12.38c6.1,2.52,13.07,2.63,19.82,2.73,7,.1,14.33.21,17.43,3.32s3.22,10.39,3.32,17.43c.1,6.75.21,13.72,2.73,19.82,2.63,6.35,7.59,11.52,12.38,16.52S224,124,224,128,219.08,137.14,214.31,142.11Z\"/></svg>",
  "lightning":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z\"/></svg>",
  "crown-simple":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M230.9,73.6A15.85,15.85,0,0,0,212,77.39l-33.67,36.29-35.8-80.29a1,1,0,0,1,0-.1,16,16,0,0,0-29.06,0,1,1,0,0,1,0,.1l-35.8,80.29L44,77.39A16,16,0,0,0,16.25,90.81c0,.11,0,.21.07.32L39,195a16,16,0,0,0,15.72,13H201.29A16,16,0,0,0,217,195L239.68,91.13c0-.11,0-.21.07-.32A15.85,15.85,0,0,0,230.9,73.6ZM201.35,191.68l-.06.32H54.71l-.06-.32L32,88l.14.16,42,45.24a8,8,0,0,0,13.18-2.18L128,40l40.69,91.25a8,8,0,0,0,13.18,2.18l42-45.24L224,88Z\"/></svg>",
  "question":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z\"/></svg>",
  "hourglass":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M200,75.64V40a16,16,0,0,0-16-16H72A16,16,0,0,0,56,40V76a16.07,16.07,0,0,0,6.4,12.8L114.67,128,62.4,167.2A16.07,16.07,0,0,0,56,180v36a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V180.36a16.09,16.09,0,0,0-6.35-12.77L141.27,128l52.38-39.6A16.05,16.05,0,0,0,200,75.64ZM184,216H72V180l56-42,56,42.35Zm0-140.36L128,118,72,76V40H184Z\"/></svg>",
  "pencil-simple":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z\"/></svg>",
  "calendar-blank":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z\"/></svg>",
  "presentation":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,40H136V24a8,8,0,0,0-16,0V40H40A16,16,0,0,0,24,56V176a16,16,0,0,0,16,16H79.36L57.75,219a8,8,0,0,0,12.5,10l29.59-37h56.32l29.59,37a8,8,0,1,0,12.5-10l-21.61-27H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,136H40V56H216V176Z\"/></svg>",
  "briefcase-simple":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M216,56H176V48a24,24,0,0,0-24-24H104A24,24,0,0,0,80,48v8H40A16,16,0,0,0,24,72V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V72A16,16,0,0,0,216,56ZM96,48a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm64,24V200H96V72ZM40,72H80V200H40ZM216,200H176V72h40V200Z\"/></svg>",
  "pulse":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M240,128a8,8,0,0,1-8,8H204.94l-37.78,75.58A8,8,0,0,1,160,216h-.4a8,8,0,0,1-7.08-5.14L95.35,60.76,63.28,131.31A8,8,0,0,1,56,136H24a8,8,0,0,1,0-16H50.85L88.72,36.69a8,8,0,0,1,14.76.46l57.51,151,31.85-63.71A8,8,0,0,1,200,120h32A8,8,0,0,1,240,128Z\"/></svg>",
  "arrows-counter":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M88,104H40a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V76.69L62.63,62.06A95.43,95.43,0,0,1,130,33.94h.53a95.36,95.36,0,0,1,67.07,27.33,8,8,0,0,1-11.18,11.44,79.52,79.52,0,0,0-55.89-22.77h-.45A79.56,79.56,0,0,0,73.94,73.37L59.31,88H88a8,8,0,0,1,0,16Zm128,48H168a8,8,0,0,0,0,16h28.69l-14.63,14.63a79.56,79.56,0,0,1-56.13,23.43h-.45a79.52,79.52,0,0,1-55.89-22.77,8,8,0,1,0-11.18,11.44,95.36,95.36,0,0,0,67.07,27.33H126a95.43,95.43,0,0,0,67.36-28.12L208,179.31V208a8,8,0,0,0,16,0V160A8,8,0,0,0,216,152Z\"/></svg>",
  "highlighter":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M253.66,106.34a8,8,0,0,0-11.32,0L192,156.69,107.31,72l50.35-50.34a8,8,0,1,0-11.32-11.32L96,60.69A16,16,0,0,0,93.18,79.5L72,100.69a16,16,0,0,0,0,22.62L76.69,128,18.34,186.34a8,8,0,0,0,3.13,13.25l72,24A7.88,7.88,0,0,0,96,224a8,8,0,0,0,5.66-2.34L136,187.31l4.69,4.69a16,16,0,0,0,22.62,0l21.19-21.18A16,16,0,0,0,203.31,168l50.35-50.34A8,8,0,0,0,253.66,106.34ZM93.84,206.85l-55-18.35L88,139.31,124.69,176ZM152,180.69,83.31,112,104,91.31,172.69,160Z\"/></svg>",
  "rocket-launch":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M223.85,47.12a16,16,0,0,0-15-15c-12.58-.75-44.73.4-71.41,27.07L132.69,64H74.36A15.91,15.91,0,0,0,63,68.68L28.7,103a16,16,0,0,0,9.07,27.16l38.47,5.37,44.21,44.21,5.37,38.49a15.94,15.94,0,0,0,10.78,12.92,16.11,16.11,0,0,0,5.1.83A15.91,15.91,0,0,0,153,227.3L187.32,193A15.91,15.91,0,0,0,192,181.64V123.31l4.77-4.77C223.45,91.86,224.6,59.71,223.85,47.12ZM74.36,80h42.33L77.16,119.52,40,114.34Zm74.41-9.45a76.65,76.65,0,0,1,59.11-22.47,76.46,76.46,0,0,1-22.42,59.16L128,164.68,91.32,128ZM176,181.64,141.67,216l-5.19-37.17L176,139.31Zm-74.16,9.5C97.34,201,82.29,224,40,224a8,8,0,0,1-8-8c0-42.29,23-57.34,32.86-61.85a8,8,0,0,1,6.64,14.56c-6.43,2.93-20.62,12.36-23.12,38.91,26.55-2.5,36-16.69,38.91-23.12a8,8,0,1,1,14.56,6.64Z\"/></svg>",
  "chat-circle":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z\"/></svg>",
  "house-simple":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M219.31,108.68l-80-80a16,16,0,0,0-22.62,0l-80,80A15.87,15.87,0,0,0,32,120v96a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V120A15.87,15.87,0,0,0,219.31,108.68ZM208,208H48V120l80-80,80,80Z\"/></svg>",
  "dice-two":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M192,32H64A32,32,0,0,0,32,64V192a32,32,0,0,0,32,32H192a32,32,0,0,0,32-32V64A32,32,0,0,0,192,32Zm16,160a16,16,0,0,1-16,16H64a16,16,0,0,1-16-16V64A16,16,0,0,1,64,48H192a16,16,0,0,1,16,16Zm-88-84a12,12,0,1,1-12-12A12,12,0,0,1,120,108Zm40,40a12,12,0,1,1-12-12A12,12,0,0,1,160,148Z\"/></svg>",
  "user":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M128,128a48,48,0,1,0-48-48A48,48,0,0,0,128,128Zm0-80a32,32,0,1,1-32,32A32,32,0,0,1,128,48Zm0,88c-44.11,0-80,31.37-80,70a8,8,0,0,0,16,0c0-30.88,28.65-54,64-54s64,23.12,64,54a8,8,0,0,0,16,0C208,167.37,172.11,136,128,136Z\"/></svg>",
  "yarn":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M232,216H183.39A103.95,103.95,0,1,0,128,232l104,0a8,8,0,1,0,0-16ZM128,40a87.51,87.51,0,0,1,43.93,11.77,222.06,222.06,0,0,0-27.88,15.09,222.23,222.23,0,0,0-45-22A87.52,87.52,0,0,1,128,40ZM78.56,55.24a206,206,0,0,1,51.11,21.57A225.76,225.76,0,0,0,110.1,93.36,181.54,181.54,0,0,0,57.73,75.09,88.67,88.67,0,0,1,78.56,55.24ZM48.72,89.82a165.82,165.82,0,0,1,49.67,15.51A228,228,0,0,0,82.76,124.5,142.65,142.65,0,0,0,41.28,113,87.5,87.5,0,0,1,48.72,89.82ZM40,129a126.07,126.07,0,0,1,33.63,9,222.36,222.36,0,0,0-19.07,38.45A87.51,87.51,0,0,1,40,129Zm26.42,61.81A209.36,209.36,0,0,1,187,62.74a89,89,0,0,1,16.22,19.57A183.89,183.89,0,0,0,87,205.82,88.56,88.56,0,0,1,66.43,190.81ZM125.66,216A87.66,87.66,0,0,1,101.83,212,167.84,167.84,0,0,1,210.28,96.79a87.35,87.35,0,0,1,5.38,23.55A144.59,144.59,0,0,0,125.66,216Zm89.82-78.44a88.19,88.19,0,0,1-72.67,77.22A128.64,128.64,0,0,1,215.48,137.53Z\"/></svg>",
  "floppy-disk-back":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M208,32H83.31A15.86,15.86,0,0,0,72,36.69L36.69,72A15.86,15.86,0,0,0,32,83.31V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM88,48h80V80H88ZM208,208H48V83.31l24-24V80A16,16,0,0,0,88,96h80a16,16,0,0,0,16-16V48h24Zm-80-96a40,40,0,1,0,40,40A40,40,0,0,0,128,112Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,176Z\"/></svg>",
  "list-bullets":
    "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 256 256\" fill=\"currentColor\"><path d=\"M80,64a8,8,0,0,1,8-8H216a8,8,0,0,1,0,16H88A8,8,0,0,1,80,64Zm136,56H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Zm0,64H88a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM44,52A12,12,0,1,0,56,64,12,12,0,0,0,44,52Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,116Zm0,64a12,12,0,1,0,12,12A12,12,0,0,0,44,180Z\"/></svg>",
};

const HN_HOME_SVG =
  "<svg width=\"48\" height=\"48\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><rect width=\"48\" height=\"48\" fill=\"#F26522\"/><path d=\"M7.72159 32V14.5455H10.8835V21.9347H18.9716V14.5455H22.142V32H18.9716V24.5852H10.8835V32H7.72159ZM39.9247 14.5455V32H37.1122L28.8878 20.1108H28.7429V32H25.581V14.5455H28.4105L36.6264 26.4432H36.7798V14.5455H39.9247Z\" fill=\"white\"/></svg>";

const ZEN_LOGIC = globalThis.ZenHnLogic;
const ZEN_HN_RESTYLE_KEY = "zenHnRestyled";
const ZEN_HN_SUBMISSIONS_KEY = "zenHnSubmissions";
const ACTION_STORE_KEY = "zenHnActions";
const ACTION_STORE_VERSION = 1;
const ACTION_STORE_DEBOUNCE_MS = 250;

let actionStore = null;
let actionStoreLoadPromise = null;
let actionStoreSaveTimer = null;

document.documentElement.dataset.zenHnActive = "true";

if (!document.documentElement.dataset.zenHnSidebar) {
  document.documentElement.dataset.zenHnSidebar = "loading";
}

if (window.location.pathname === "/item") {
  document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "loading";
}

function registerIcon(name, svg) {
  if (!name || !svg) {
    return;
  }
  PHOSPHOR_SVGS[name] = svg;
}

function renderIcon(name) {
  if (name === "hn-home") {
    return HN_HOME_SVG;
  }
  return PHOSPHOR_SVGS[name] || "";
}

const SUBMISSION_MENU_CLASS = "hn-submission-menu";
const SUBMISSION_MENU_OPEN_CLASS = "is-open";
let submissionMenuHandlersRegistered = false;

function setSubmissionMenuState(menu, isOpen) {
  if (!menu) {
    return;
  }
  menu.classList.toggle(SUBMISSION_MENU_OPEN_CLASS, isOpen);
  const button = menu.querySelector(".hn-menu-button");
  if (button) {
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
}

function closeAllSubmissionMenus(exceptMenu) {
  const openMenus = document.querySelectorAll(
    `.${SUBMISSION_MENU_CLASS}.${SUBMISSION_MENU_OPEN_CLASS}`,
  );
  openMenus.forEach((menu) => {
    if (menu === exceptMenu) {
      return;
    }
    setSubmissionMenuState(menu, false);
  });
}

function registerSubmissionMenuListeners() {
  if (submissionMenuHandlersRegistered) {
    return;
  }
  submissionMenuHandlersRegistered = true;
  document.addEventListener("click", (event) => {
    const openMenus = document.querySelectorAll(
      `.${SUBMISSION_MENU_CLASS}.${SUBMISSION_MENU_OPEN_CLASS}`,
    );
    if (!openMenus.length) {
      return;
    }
    openMenus.forEach((menu) => {
      if (menu.contains(event.target)) {
        return;
      }
      setSubmissionMenuState(menu, false);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }
    closeAllSubmissionMenus();
  });
}

function isHomeSidebarLink(href, text) {
  const normalized = (href || "").trim().toLowerCase();
  if (!normalized) {
    return false;
  }
  if (normalized === "/" || normalized === "news" || normalized === "/news") {
    return true;
  }
  if (normalized.startsWith("news?")) {
    return true;
  }
  return text?.trim().toLowerCase() === "hacker news" && normalized === "news";
}

const RANDOM_ITEM_MAX_ATTEMPTS = 6;

function normalizeItemId(value) {
  const parsed = Number.parseInt(value || "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return "";
  }
  return String(parsed);
}

function parseItemIdFromDocument(doc) {
  if (!doc) {
    return "";
  }
  const rowId = normalizeItemId(doc.querySelector("tr.athing[id]")?.getAttribute("id"));
  if (rowId) {
    return rowId;
  }
  const linkHref = doc.querySelector("a[href^='item?id=']")?.getAttribute("href") || "";
  const params = getHrefParams(linkHref);
  return normalizeItemId(params.get("id"));
}

async function fetchNewestItemId() {
  try {
    const response = await fetch("/newest", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) {
      return "";
    }
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    return parseItemIdFromDocument(doc);
  } catch (error) {
    return "";
  }
}

function resolveHrefWithBase(href, baseHref) {
  if (!href) {
    return "";
  }
  try {
    const base = baseHref || globalThis.location?.href || "https://news.ycombinator.com/";
    return new URL(href, base).toString();
  } catch (error) {
    return href;
  }
}

async function resolveStoryHrefFromItem(itemId) {
  if (!itemId) {
    return "";
  }
  try {
    const response = await fetch(`item?id=${itemId}`, {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (!response.ok) {
      return "";
    }
    const html = await response.text();
    if (/No such item/i.test(html)) {
      return "";
    }
    const doc = new DOMParser().parseFromString(html, "text/html");
    const onStoryHref = doc.querySelector(".onstory a")?.getAttribute("href") || "";
    if (onStoryHref) {
      return resolveHrefWithBase(onStoryHref, response.url);
    }
    const storyHref = ZEN_LOGIC.buildItemHref(itemId, response.url) || `item?id=${itemId}`;
    return resolveHrefWithBase(storyHref, response.url);
  } catch (error) {
    return "";
  }
}

async function resolveRandomStoryHref(maxId) {
  const max = Number.parseInt(maxId || "", 10);
  if (!Number.isFinite(max) || max < 1) {
    return "";
  }
  const maxString = String(max);
  for (let attempt = 0; attempt < RANDOM_ITEM_MAX_ATTEMPTS; attempt += 1) {
    const candidate = Math.floor(Math.random() * max) + 1;
    const storyHref = await resolveStoryHrefFromItem(candidate);
    if (storyHref) {
      return storyHref;
    }
  }
  return ZEN_LOGIC.buildItemHref(maxString, window.location.href)
    || `item?id=${maxString}`;
}

async function handleRandomItemClick(event) {
  event.preventDefault();
  const link = event.currentTarget;
  if (link?.dataset?.randomPending === "true") {
    return;
  }
  if (link) {
    link.dataset.randomPending = "true";
    link.setAttribute("aria-busy", "true");
  }
  try {
    const newestId = await fetchNewestItemId();
    const randomHref = await resolveRandomStoryHref(newestId);
    if (!randomHref && !newestId) {
      window.location.href = "/newest";
      return;
    }
    const fallbackHref = newestId
      ? (ZEN_LOGIC.buildItemHref(newestId, window.location.href) || `item?id=${newestId}`)
      : "/newest";
    const targetHref = randomHref || fallbackHref;
    window.location.href = targetHref;
  } finally {
    if (link) {
      delete link.dataset.randomPending;
      link.removeAttribute("aria-busy");
    }
  }
}

function buildSidebarNavigation() {
  if (document.getElementById("zen-hn-sidebar")) {
    document.documentElement.dataset.zenHnSidebar = "true";
    return true;
  }
  const pagetops = Array.from(document.querySelectorAll("span.pagetop"));
  if (!pagetops.length) {
    return false;
  }
  const linkNodes = pagetops.flatMap((node) => Array.from(node.querySelectorAll("a")));
  if (!linkNodes.length) {
    return false;
  }
  const seen = new Set();
  const list = document.createElement("ul");
  list.className = "zen-hn-sidebar-list";
  const profileLink = document.querySelector("a#me")
    || document.querySelector("span.pagetop a[href^='user?id=']");
  const loginLink = document.querySelector("span.pagetop a[href^='login']");
  const userLink = profileLink || loginLink;
  const userHref = userLink?.getAttribute("href") || "/login";
  const userLabel = userLink ? (userLink === loginLink ? "Log in" : "Profile") : "Log in";
  // Create separate home button for top of sidebar
  const homeButtonItem = document.createElement("li");
  homeButtonItem.className = "zen-hn-sidebar-item";
  const homeButton = document.createElement("a");
  homeButton.className = "zen-hn-sidebar-icon-link zen-hn-home-button";
  homeButton.href = "/";
  homeButton.setAttribute("aria-label", "Home");
  homeButton.setAttribute("title", "Home");
  homeButton.innerHTML = HN_HOME_SVG;
  homeButtonItem.appendChild(homeButton);

  const iconLinks = [
    { href: "/news", icon: "house-simple", label: "News" },
    { href: "/newest", icon: "seal", label: "New" },
    { href: "/active", icon: "lightning", label: "Active" },
    { href: "/best", icon: "crown-simple", label: "Best" },
    { href: "/ask", icon: "chat-circle", label: "Ask" },
    {
      href: "/newest",
      icon: "dice-two",
      label: "Random",
      action: "random",
    },
  ];
  // Set hasHomeIcon to true to prevent creating another home icon in the loop below
  const hasHomeIcon = true;
  const iconGroup = document.createElement("li");
  iconGroup.className = "zen-hn-sidebar-item zen-hn-sidebar-icons";
  iconLinks.forEach((item) => {
    const iconLink = document.createElement("a");
    iconLink.className = "zen-hn-sidebar-icon-link";
    iconLink.href = item.href;
    iconLink.setAttribute("aria-label", item.label);
    iconLink.setAttribute("title", item.label);
    iconLink.innerHTML = renderIcon(item.icon);
    if (item.action === "random") {
      iconLink.addEventListener("click", handleRandomItemClick);
    }
    iconGroup.appendChild(iconLink);
  });
  const bottomGroup = document.createElement("li");
  bottomGroup.className = "zen-hn-sidebar-item zen-hn-sidebar-bottom zen-hn-sidebar-bottom-group";
  const submitLink = document.createElement("a");
  submitLink.className = "zen-hn-sidebar-icon-link";
  submitLink.href = "/submit";
  submitLink.setAttribute("aria-label", "Submit");
  submitLink.setAttribute("title", "Submit");
  submitLink.innerHTML = renderIcon("pencil-simple");
  const userIconLink = document.createElement("a");
  userIconLink.className = "zen-hn-sidebar-icon-link";
  userIconLink.href = userHref;
  userIconLink.setAttribute("aria-label", userLabel);
  userIconLink.setAttribute("title", userLabel);
  userIconLink.innerHTML = renderIcon("user");
  bottomGroup.appendChild(submitLink);
  bottomGroup.appendChild(userIconLink);
  linkNodes.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const text = link.textContent?.trim() || "";
    if (!href || !text) {
      return;
    }
    if (!isHomeSidebarLink(href, text)) {
      return;
    }
    if (hasHomeIcon) {
      return;
    }
    const key = `${href}::${text}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    const item = document.createElement("li");
    item.className = "zen-hn-sidebar-item";
    const clone = link.cloneNode(true);
    clone.classList.add("zen-hn-sidebar-link");
    clone.classList.add("is-home-icon");
    clone.setAttribute("aria-label", "Home");
    clone.setAttribute("title", "Home");
    clone.innerHTML = HN_HOME_SVG;
    item.appendChild(clone);
    list.appendChild(item);
  });
  list.appendChild(homeButtonItem);
  list.appendChild(iconGroup);
  list.appendChild(bottomGroup);
  if (!list.childNodes.length) {
    return false;
  }
  const nav = document.createElement("nav");
  nav.className = "zen-hn-sidebar-nav";
  nav.appendChild(list);
  const sidebar = document.createElement("aside");
  sidebar.id = "zen-hn-sidebar";
  sidebar.setAttribute("aria-label", "Hacker News navigation");
  sidebar.appendChild(nav);
  document.body.appendChild(sidebar);
  document.documentElement.dataset.zenHnSidebar = "true";
  const headerRow = pagetops[0]?.closest("tr");
  if (headerRow) {
    headerRow.style.display = "none";
  }
  const pageSpacer = document.querySelector("tr#pagespace");
  if (pageSpacer) {
    pageSpacer.style.display = "none";
  }
  return true;
}

function runSidebarWhenReady() {
  let attempts = 0;
  const maxAttempts = 60;
  const attempt = () => {
    const built = buildSidebarNavigation();
    if (built) {
      return;
    }
    attempts += 1;
    if (attempts >= maxAttempts && document.readyState !== "loading") {
      if (document.documentElement.dataset.zenHnSidebar === "loading") {
        delete document.documentElement.dataset.zenHnSidebar;
      }
      return;
    }
    window.requestAnimationFrame(attempt);
  };
  attempt();
}

function getIndentLevelFromRow(row) {
  if (!row) {
    return 0;
  }
  const indentImg = row.querySelector("td.ind img");
  const indentWidth = Number.parseInt(indentImg?.getAttribute("width") || "0", 10) || 0;
  return Math.round(indentWidth / 40) || 0;
}

function getIndentLevelFromItem(item) {
  return Number.parseInt(item?.dataset.indentLevel || "0", 10) || 0;
}

function setCollapseButtonState(button, isCollapsed, hasChildren) {
  if (!button) {
    return;
  }
  const targetLabel = hasChildren ? "thread" : "comment";
  button.classList.toggle("is-collapsed", isCollapsed);
  button.setAttribute("aria-expanded", isCollapsed ? "false" : "true");
  button.setAttribute(
    "aria-label",
    isCollapsed ? `Expand ${targetLabel}` : `Collapse ${targetLabel}`,
  );
}

function hideDescendantComments(item) {
  const baseLevel = getIndentLevelFromItem(item);
  let sibling = item.nextElementSibling;
  while (sibling && sibling.classList.contains("hn-comment")) {
    const level = getIndentLevelFromItem(sibling);
    if (level <= baseLevel) {
      break;
    }
    sibling.hidden = true;
    sibling = sibling.nextElementSibling;
  }
}

function restoreDescendantVisibility(item) {
  const baseLevel = getIndentLevelFromItem(item);
  let sibling = item.nextElementSibling;
  const collapsedStack = [];
  while (sibling && sibling.classList.contains("hn-comment")) {
    const level = getIndentLevelFromItem(sibling);
    if (level <= baseLevel) {
      break;
    }
    while (collapsedStack.length && level <= collapsedStack[collapsedStack.length - 1]) {
      collapsedStack.pop();
    }
    const isHiddenByAncestor = collapsedStack.length > 0;
    sibling.hidden = isHiddenByAncestor;
    const isCollapsed = sibling.dataset.collapsed === "true";
    if (!isHiddenByAncestor && isCollapsed) {
      collapsedStack.push(level);
    }
    sibling = sibling.nextElementSibling;
  }
}

function toggleCommentCollapse(item) {
  const isCollapsed = item.dataset.collapsed === "true";
  const nextCollapsed = !isCollapsed;
  item.dataset.collapsed = nextCollapsed ? "true" : "false";
  const hasChildren = item.dataset.hasChildren === "true";
  const collapseButton = item.querySelector(".hn-collapse-button");
  setCollapseButtonState(collapseButton, nextCollapsed, hasChildren);
  if (nextCollapsed) {
    hideDescendantComments(item);
  } else {
    restoreDescendantVisibility(item);
  }
}

function getHrefParams(href) {
  if (!href) {
    return new URLSearchParams();
  }
  const queryStart = href.indexOf("?");
  if (queryStart === -1) {
    return new URLSearchParams();
  }
  return new URLSearchParams(href.slice(queryStart + 1));
}

function getDefaultActionStore() {
  return { version: ACTION_STORE_VERSION, byUser: {} };
}

function normalizeActionStore(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return getDefaultActionStore();
  }
  const version = Number(raw.version);
  if (version !== ACTION_STORE_VERSION) {
    return getDefaultActionStore();
  }
  if (!raw.byUser || typeof raw.byUser !== "object" || Array.isArray(raw.byUser)) {
    return getDefaultActionStore();
  }
  return { version: ACTION_STORE_VERSION, byUser: raw.byUser };
}

function loadActionStore() {
  if (actionStoreLoadPromise) {
    return actionStoreLoadPromise;
  }
  actionStoreLoadPromise = new Promise((resolve) => {
    if (!globalThis.chrome?.storage?.local) {
      console.log("[ZenHN] No chrome.storage.local available, using default store");
      actionStore = getDefaultActionStore();
      resolve(actionStore);
      return;
    }
    chrome.storage.local.get({ [ACTION_STORE_KEY]: null }, (result) => {
      const raw = result ? result[ACTION_STORE_KEY] : null;
      console.log("[ZenHN] Loaded raw action store:", raw);
      actionStore = normalizeActionStore(raw);
      console.log("[ZenHN] Normalized action store:", actionStore);
      resolve(actionStore);
    });
  });
  return actionStoreLoadPromise;
}

function scheduleActionStoreSave() {
  if (!globalThis.chrome?.storage?.local || !actionStore) {
    console.log("[ZenHN] scheduleActionStoreSave: skipped (no storage or store)");
    return;
  }
  if (actionStoreSaveTimer) {
    globalThis.clearTimeout(actionStoreSaveTimer);
  }
  console.log("[ZenHN] scheduleActionStoreSave: scheduling save...");
  actionStoreSaveTimer = globalThis.setTimeout(() => {
    actionStoreSaveTimer = null;
    console.log("[ZenHN] Saving action store to chrome.storage:", actionStore);
    chrome.storage.local.set({ [ACTION_STORE_KEY]: actionStore }, () => {
      if (chrome.runtime.lastError) {
        console.error("[ZenHN] Error saving action store:", chrome.runtime.lastError);
      } else {
        console.log("[ZenHN] Action store saved successfully");
      }
    });
  }, ACTION_STORE_DEBOUNCE_MS);
}

function getCurrentUserKey() {
  const meLink = document.querySelector("a#me");
  const headerLink = document.querySelector("span.pagetop a[href^='user?id=']");
  const link = meLink || headerLink;
  if (!link) {
    return "anonymous";
  }
  const href = link.getAttribute("href") || "";
  const params = getHrefParams(href);
  const fromHref = params.get("id") || "";
  const fromText = link.textContent?.trim() || "";
  return fromHref || fromText || "anonymous";
}

function getUserActionBucket() {
  if (!actionStore) {
    actionStore = getDefaultActionStore();
  }
  const username = getCurrentUserKey();
  if (!actionStore.byUser[username]) {
    actionStore.byUser[username] = { stories: {}, comments: {} };
  }
  return { username, bucket: actionStore.byUser[username] };
}

function getStoredAction(kind, id) {
  if (!actionStore || !id) {
    console.log("[ZenHN] getStoredAction: no store or id", { actionStore: !!actionStore, id });
    return null;
  }
  const { username, bucket } = getUserActionBucket();
  const result = bucket?.[kind]?.[id] || null;
  console.log("[ZenHN] getStoredAction:", { kind, id, username, result });
  return result;
}

function updateStoredAction(kind, id, update) {
  if (!actionStore || !id || !update) {
    console.log("[ZenHN] updateStoredAction: skipped", { actionStore: !!actionStore, id, update });
    return;
  }
  const { username, bucket } = getUserActionBucket();
  console.log("[ZenHN] updateStoredAction:", { kind, id, update, username });
  const current = bucket?.[kind]?.[id] || {};
  const next = { ...current };
  if (Object.prototype.hasOwnProperty.call(update, "vote")) {
    if (update.vote === "up" || update.vote === "down") {
      next.vote = update.vote;
    } else {
      delete next.vote;
    }
  }
  if (Object.prototype.hasOwnProperty.call(update, "favorite")) {
    if (update.favorite === true) {
      next.favorite = true;
    } else {
      delete next.favorite;
    }
  }
  if (!next.vote && !next.favorite) {
    if (bucket?.[kind]) {
      delete bucket[kind][id];
      if (Object.keys(bucket[kind]).length === 0) {
        delete bucket[kind];
      }
    }
  } else {
    next.updatedAt = Date.now();
    if (!bucket[kind]) {
      bucket[kind] = {};
    }
    bucket[kind][id] = next;
  }
  scheduleActionStoreSave();
}

function getCommentId(row, comhead) {
  const link = comhead?.querySelector("a[href^='item?id=']")
    || row.querySelector("a[href^='item?id=']");
  if (!link) {
    return "";
  }
  const href = link.getAttribute("href") || "";
  const params = getHrefParams(href);
  return params.get("id") || "";
}

function getReplyHref(row, comhead) {
  const linkByHref = row.querySelector("a[href^='reply?id=']");
  const linkByText = comhead
    ? Array.from(comhead.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase();
        return text === "reply";
      })
    : null;
  const link = linkByHref || linkByText;
  return link?.getAttribute("href") || "";
}

function getVoteState(row) {
  const upArrow = row.querySelector(".votearrow:not(.down)");
  const downArrow = row.querySelector(".votearrow.down");
  let isUpvoted = Boolean(upArrow?.classList.contains("voted"));
  let isDownvoted = Boolean(downArrow?.classList.contains("voted"));
  if (isUpvoted && isDownvoted) {
    isDownvoted = false;
  }
  return { isUpvoted, isDownvoted };
}

async function copyTextToClipboard(text) {
  if (!text) {
    return false;
  }
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fall through to legacy copy.
    }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch (error) {
    success = false;
  }
  document.body.removeChild(textarea);
  return success;
}

async function resolveReplyForm(replyHref) {
  if (!replyHref) {
    return null;
  }
  const response = await fetch(replyHref, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const form = doc.querySelector("form");
  if (!form) {
    return null;
  }
  const action = form.getAttribute("action") || "";
  const method = (form.getAttribute("method") || "post").toUpperCase();
  const inputs = Array.from(form.querySelectorAll("input[name]"));
  const fields = {};
  inputs.forEach((input) => {
    fields[input.name] = input.value || "";
  });
  const textName = form.querySelector("textarea[name]")?.getAttribute("name") || "text";
  const actionUrl = new URL(action || response.url, response.url).toString();
  return {
    actionUrl,
    method,
    fields,
    textName,
  };
}

function resolveReplyFormFromElement(form) {
  if (!form) {
    return null;
  }
  const action = form.getAttribute("action") || "";
  const method = (form.getAttribute("method") || "post").toUpperCase();
  const inputs = Array.from(form.querySelectorAll("input[name]"));
  const fields = {};
  inputs.forEach((input) => {
    fields[input.name] = input.value || "";
  });
  const textName = form.querySelector("textarea[name]")?.getAttribute("name") || "text";
  const actionUrl = new URL(action || window.location.href, window.location.href).toString();
  return {
    actionUrl,
    method,
    fields,
    textName,
  };
}

async function submitReplyWithResolved(resolved, text) {
  if (!resolved) {
    return { ok: false };
  }
  const payload = new URLSearchParams({
    ...resolved.fields,
    [resolved.textName]: text,
  });
  let response = null;
  if (resolved.method === "GET") {
    const url = new URL(resolved.actionUrl);
    payload.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    response = await fetch(url.toString(), {
      credentials: "same-origin",
      cache: "no-store",
    });
  } else {
    response = await fetch(resolved.actionUrl, {
      method: resolved.method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
      credentials: "same-origin",
      cache: "no-store",
    });
  }
  return {
    ok: response?.ok,
    status: response?.status,
  };
}

async function submitReply(replyHref, text) {
  try {
    const resolved = await resolveReplyForm(replyHref);
    if (!resolved) {
      return { ok: false };
    }
    return await submitReplyWithResolved(resolved, text);
  } catch (error) {
    return { ok: false };
  }
}


async function resolveFavoriteLink(commentId) {
  if (!commentId) {
    return null;
  }
  const response = await fetch(`item?id=${commentId}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const comheads = Array.from(doc.querySelectorAll(".comhead"));
  const targetComhead = comheads.find((head) =>
    head.querySelector(`a[href^='item?id=${commentId}']`),
  );
  const comhead = targetComhead || comheads[0];
  if (!comhead) {
    return null;
  }
  const linkById = comhead.querySelector("a[href^='fave?id='], a[id^='fav_'], a[id^='fave_']");
  const linkByText = Array.from(comhead.querySelectorAll("a")).find((link) => {
    const text = link.textContent?.trim().toLowerCase();
    return text === "favorite" || text === "unfavorite";
  });
  const link = linkById || linkByText;
  if (!link) {
    return null;
  }
  const text = link.textContent?.trim().toLowerCase() || "";
  const href = link.getAttribute("href") || "";
  return {
    href,
    isFavorited: text === "unfavorite" || href.includes("un=t"),
  };
}

async function resolveStoryFavoriteLink(itemId) {
  if (!itemId) {
    return null;
  }
  const response = await fetch(`item?id=${itemId}`, {
    credentials: "same-origin",
    cache: "no-store",
  });
  if (!response.ok) {
    return null;
  }
  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const fatitem = doc.querySelector("table.fatitem");
  const subtext = fatitem?.querySelector(".subtext");
  if (!subtext) {
    return null;
  }
  const linkById = subtext.querySelector("a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']");
  const linkByText = Array.from(subtext.querySelectorAll("a")).find((link) => {
    const text = link.textContent?.trim().toLowerCase();
    return text === "favorite" || text === "unfavorite";
  });
  const link = linkById || linkByText;
  if (!link) {
    return null;
  }
  const text = link.textContent?.trim().toLowerCase() || "";
  const href = link.getAttribute("href") || "";
  return {
    href,
    isFavorited: text === "unfavorite" || href.includes("un=t"),
  };
}



function buildNextFavoriteHref(href, willBeFavorited) {
  if (!href) {
    return "";
  }
  try {
    const url = new URL(href, window.location.href);
    if (willBeFavorited) {
      url.searchParams.delete("un");
    } else {
      url.searchParams.set("un", "t");
    }
    return url.toString();
  } catch (error) {
    if (willBeFavorited) {
      return href.replace(/([?&])un=t(&|$)/, "$1").replace(/[?&]$/, "");
    }
    return href.includes("un=t") ? href : `${href}${href.includes("?") ? "&" : "?"}un=t`;
  }
}

function stripParenTextNodes(element) {
  if (!element) {
    return;
  }
  const nodes = Array.from(element.childNodes);
  nodes.forEach((node) => {
    if (node.nodeType !== Node.TEXT_NODE) {
      return;
    }
    const nextText = node.textContent?.replace(/[()]/g, "").trim() || "";
    if (!nextText) {
      node.remove();
      return;
    }
    node.textContent = nextText;
  });
}

function toSentenceCase(text) {
  const trimmed = (text || "").trim();
  if (!trimmed) {
    return "";
  }
  const lower = trimmed.toLowerCase();
  return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
}

function isUserProfilePage() {
  const op = document.documentElement.getAttribute("op") || "";
  if (op.toLowerCase() === "user") {
    return true;
  }
  return window.location.pathname === "/user";
}

function restyleSubmissions() {
  if (isUserProfilePage()) {
    return;
  }
  const bigboxRow = document.querySelector("tr#bigbox");
  const itemList = document.querySelector("table.itemlist");
  const bigboxTable = bigboxRow?.querySelector("table");
  const sourceTable = itemList || bigboxTable;
  if (!sourceTable || sourceTable.dataset[ZEN_HN_SUBMISSIONS_KEY] === "true") {
    return;
  }

  if (document.querySelector("table.comment-tree")) {
    return;
  }

  const rows = getStoryRows(sourceTable);
  if (!rows.length) {
    return;
  }

  const mode = itemList ? "itemlist" : "bigbox";
  const container = document.createElement("div");
  container.className = "hn-submissions";
  registerSubmissionMenuListeners();

  rows.forEach((row) => {
    const titleLine = row.querySelector(".titleline");
    const titleLink = titleLine?.querySelector("a")
      || row.querySelector("a.storylink")
      || row.querySelector("a.titlelink")
      || row.querySelector("a");
    if (!titleLink) {
      return;
    }

    const item = document.createElement("div");
    item.className = "hn-submission";
    const itemId = row.getAttribute("id") || "";

    const rankText = row.querySelector(".rank")?.textContent?.trim() || "";
    const rank = document.createElement("div");
    rank.className = "hn-submission-rank";
    rank.textContent = rankText;
    if (!rankText) {
      rank.classList.add("is-empty");
    }

    const subtextRow = row.nextElementSibling;
    const subtext = subtextRow?.querySelector(".subtext");

    const { isUpvoted } = getVoteState(row);
    let isUpvotedState = isUpvoted;
    let upvoteLink = row.querySelector("a[id^='up_']");
    let unvoteLink = row.querySelector("a[id^='un_'], a[href*='how=un']");
    if (!upvoteLink && subtextRow) {
      upvoteLink = subtextRow.querySelector("a[id^='up_']");
    }
    if (!upvoteLink && subtext) {
      upvoteLink = Array.from(subtext.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase() || "";
        return text === "upvote" || text === "vote";
      });
    }
    if (!unvoteLink && subtextRow) {
      unvoteLink = subtextRow.querySelector("a[id^='un_'], a[href*='how=un']");
    }
    if (!unvoteLink && subtext) {
      unvoteLink = Array.from(subtext.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase() || "";
        return text === "unvote";
      });
    }
    const upvoteHref = upvoteLink?.getAttribute("href") || "";
    const unvoteHref = unvoteLink?.getAttribute("href") || "";
    const voteItemId = ZEN_LOGIC.resolveVoteItemId(upvoteHref || unvoteHref, window.location.href);
    const effectiveItemId = voteItemId || itemId;
    if (effectiveItemId) {
      item.dataset.itemId = effectiveItemId;
    }
    const storedStoryAction = effectiveItemId
      ? getStoredAction("stories", effectiveItemId)
      : null;

    const hasVoteLinks = Boolean(upvoteLink || unvoteLink);
    const storedVote = storedStoryAction?.vote;
    const domUpvoted = isUpvoted || Boolean(unvoteLink);
    if (hasVoteLinks && effectiveItemId) {
      if (domUpvoted && storedVote !== "up") {
        updateStoredAction("stories", effectiveItemId, { vote: "up" });
      }
    }
    if (!domUpvoted && !hasVoteLinks && storedVote === "up") {
      isUpvotedState = true;
    } else if (domUpvoted) {
      isUpvotedState = true;
    }

    const body = document.createElement("div");
    body.className = "hn-submission-body";

    const titleRow = document.createElement("div");
    titleRow.className = "hn-submission-titleline";
    const titleClone = titleLink.cloneNode(true);
    titleClone.classList.add("hn-submission-title");
    titleRow.appendChild(titleClone);
    body.appendChild(titleRow);

    const meta = document.createElement("div");
    meta.className = "hn-submission-meta";

    const appendMetaItem = (node, className) => {
      if (!node) {
        return;
      }
      const clone = node.cloneNode(true);
      if (className) {
        clone.classList.add(className);
      }
      if (className === "hn-submission-site" || clone.classList.contains("sitebit")) {
        stripParenTextNodes(clone);
      }
      meta.appendChild(clone);
    };

    const score = subtext?.querySelector(".score");
    const hnuser = subtext?.querySelector(".hnuser");
    const age = subtext?.querySelector(".age");
    const sitebit = titleLine?.querySelector(".sitebit");
    const commentsLink = subtext
      ? Array.from(subtext.querySelectorAll("a")).find((link) => {
          const text = link.textContent?.trim().toLowerCase() || "";
          return text.includes("comment") || text.includes("discuss");
        })
      : null;
    const hideLinkByHref = subtext?.querySelector("a[href^='hide?id='], a[href^='unhide?id=']");
    const hideLinkByText = subtext
      ? Array.from(subtext.querySelectorAll("a")).find((link) => {
          const text = link.textContent?.trim().toLowerCase() || "";
          return text === "hide" || text === "unhide";
        })
      : null;
    const hideLink = hideLinkByHref || hideLinkByText;
    const flagLinkByHref = subtext?.querySelector(
      "a[href^='flag?id='], a[href^='unflag?id='], a[id^='flag_']",
    );
    const flagLinkByText = subtext
      ? Array.from(subtext.querySelectorAll("a")).find((link) => {
          const text = link.textContent?.trim().toLowerCase() || "";
          return text === "flag" || text === "unflag";
        })
      : null;
    const flagLink = flagLinkByHref || flagLinkByText;

    appendMetaItem(score, "hn-submission-score");
    appendMetaItem(hnuser, "hn-submission-user");
    appendMetaItem(age, "hn-submission-age");
    appendMetaItem(commentsLink, "hn-submission-comments");
    appendMetaItem(sitebit, "hn-submission-site");

    const actions = document.createElement("div");
    actions.className = "hn-comment-actions hn-submission-actions";

    const upvoteButton = document.createElement("button");
    upvoteButton.className = "icon-button";
    upvoteButton.type = "button";
    upvoteButton.setAttribute("aria-label", "Upvote");
    upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
    upvoteButton.innerHTML = renderIcon("arrow-fat-up");
    if (isUpvotedState) {
      upvoteButton.classList.add("is-active");
    }
    if (upvoteLink || isUpvotedState) {
      upvoteButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const voteHref = isUpvotedState
          ? (unvoteHref || ZEN_LOGIC.buildVoteHref(upvoteHref, "un", window.location.href))
          : upvoteHref;
        if (!voteHref) {
          return;
        }
        fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
        isUpvotedState = !isUpvotedState;
        if (effectiveItemId) {
          updateStoredAction("stories", effectiveItemId, { vote: isUpvotedState ? "up" : null });
        }
        upvoteButton.classList.toggle("is-active", isUpvotedState);
        upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
      });
    } else {
      upvoteButton.hidden = true;
    }

    const favoriteLinkById = subtext?.querySelector(
      "a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']",
    );
    const favoriteLinkByText = subtext
      ? Array.from(subtext.querySelectorAll("a")).find((link) => {
          const text = link.textContent?.trim().toLowerCase();
          return text === "favorite" || text === "unfavorite";
        })
      : null;
    const favoriteLink = favoriteLinkById || favoriteLinkByText;
    const favoriteText = favoriteLink?.textContent?.trim().toLowerCase() || "";
    const storedFavorite = storedStoryAction?.favorite;
    const hasFavoriteSignal = Boolean(favoriteLink);
    const domFavorited = favoriteText === "unfavorite";
    let isFavorited = domFavorited || storedFavorite === true;
    console.log("[ZenHN] Favorite state:", {
      effectiveItemId,
      favoriteText,
      storedFavorite,
      hasFavoriteSignal,
      domFavorited,
      isFavorited,
    });
    // Only sync TO storage when DOM shows favorited but we don't have it stored
    // Never clear stored favorites based on DOM state
    if (hasFavoriteSignal && effectiveItemId && domFavorited && storedFavorite !== true) {
      updateStoredAction("stories", effectiveItemId, { favorite: true });
    }
    console.log("[ZenHN] Final favorite state for item", effectiveItemId, ":", isFavorited);
    let favoriteHref = favoriteLink?.getAttribute("href") || "";

    const bookmarkButton = document.createElement("button");
    bookmarkButton.className = "icon-button";
    bookmarkButton.type = "button";
    bookmarkButton.setAttribute("aria-label", "Favorite");
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    bookmarkButton.innerHTML = renderIcon("bookmark-simple");
    if (isFavorited) {
      bookmarkButton.classList.add("is-active");
    }
    bookmarkButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const wasFavorited = isFavorited;
      isFavorited = ZEN_LOGIC.toggleFavoriteState(isFavorited);
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
      if (effectiveItemId) {
        updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
      }
      if (!favoriteHref && effectiveItemId) {
        bookmarkButton.disabled = true;
        const resolved = await resolveStoryFavoriteLink(effectiveItemId);
        bookmarkButton.disabled = false;
        if (!resolved?.href) {
          isFavorited = wasFavorited;
          bookmarkButton.classList.toggle("is-active", isFavorited);
          bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
          if (effectiveItemId) {
            updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
          }
          return;
        }
        favoriteHref = resolved.href;
      }
      if (!favoriteHref) {
        isFavorited = wasFavorited;
        bookmarkButton.classList.toggle("is-active", isFavorited);
        bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
        if (effectiveItemId) {
          updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
        }
        return;
      }
      await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
      isFavorited = ZEN_LOGIC.willFavoriteFromHref(favoriteHref);
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
      if (effectiveItemId) {
        updateStoredAction("stories", effectiveItemId, { favorite: isFavorited });
      }
      favoriteHref = buildNextFavoriteHref(favoriteHref, !isFavorited);
    });

    const linkButton = document.createElement("button");
    linkButton.className = "icon-button";
    linkButton.type = "button";
    linkButton.setAttribute("aria-label", "Copy link");
    const linkIconSwap = document.createElement("span");
    linkIconSwap.className = "icon-swap";
    linkIconSwap.innerHTML = `
      <span class="icon-default">${renderIcon("link-simple")}</span>
      <span class="icon-success">${renderIcon("check-circle")}</span>
    `;
    linkButton.appendChild(linkIconSwap);
    let copyResetTimer = null;
    linkButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const commentsHref = commentsLink?.getAttribute("href") || "";
      const targetHref = ZEN_LOGIC.resolveSubmissionCopyHref(
        commentsHref,
        effectiveItemId,
        window.location.href,
      ) || window.location.href;
      const copied = await copyTextToClipboard(targetHref);
      if (copied) {
        if (copyResetTimer) {
          window.clearTimeout(copyResetTimer);
        }
        linkButton.classList.add("is-copied");
        linkButton.classList.add("is-active");
        copyResetTimer = window.setTimeout(() => {
          linkButton.classList.remove("is-copied");
          linkButton.classList.remove("is-active");
          copyResetTimer = null;
        }, 1500);
      }
    });

    actions.appendChild(upvoteButton);
    actions.appendChild(bookmarkButton);
    actions.appendChild(linkButton);

    const extraLinks = [];
    if (subtext) {
      const ageLink = age?.querySelector("a");
      const excludedLinks = new Set([
        hnuser,
        ageLink,
        commentsLink,
        favoriteLink,
        upvoteLink,
        unvoteLink,
        hideLink,
        flagLink,
      ]);
      extraLinks.push(
        ...Array.from(subtext.querySelectorAll("a")).filter(
          (link) => !excludedLinks.has(link),
        ),
      );
    }

    const hideHref = hideLink?.getAttribute("href") || "";
    const flagHref = flagLink?.getAttribute("href") || "";
    const menuItems = ZEN_LOGIC.buildMenuItems([
      {
        href: hideHref,
        text: hideLink?.textContent,
        fallback: "Hide",
        action: "hide",
      },
      {
        href: flagHref,
        text: flagLink?.textContent,
        fallback: "Flag",
        action: "flag",
      },
    ]);
    const extraMenuItems = extraLinks
      .map((link) => {
        const href = link.getAttribute("href") || "";
        if (!href) {
          return null;
        }
        const label = toSentenceCase(link.textContent);
        if (!label) {
          return null;
        }
        return {
          label,
          href,
          action: "extra",
        };
      })
      .filter((item) => item?.href && item.label);
    menuItems.push(...extraMenuItems);

    const menuWrapper = document.createElement("div");
    menuWrapper.className = SUBMISSION_MENU_CLASS;

    const menuButton = document.createElement("button");
    menuButton.className = "icon-button hn-menu-button";
    menuButton.type = "button";
    menuButton.setAttribute("aria-label", "More actions");
    menuButton.setAttribute("aria-haspopup", "menu");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.innerHTML = renderIcon("dots-three");

    const menuDropdown = document.createElement("div");
    menuDropdown.className = "hn-submission-menu-dropdown";
    menuDropdown.setAttribute("role", "menu");

    if (!menuItems.length) {
      menuButton.disabled = true;
    }

    menuItems.forEach((menuItem) => {
      const itemButton = document.createElement("button");
      itemButton.className = "hn-submission-menu-item";
      itemButton.type = "button";
      itemButton.setAttribute("role", "menuitem");
      itemButton.textContent = menuItem.label;
      itemButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        setSubmissionMenuState(menuWrapper, false);
        if (menuItem.action === "hide") {
          item.remove();
        }
        if (menuItem.href) {
          fetch(menuItem.href, { credentials: "same-origin", cache: "no-store" });
        }
      });
      menuDropdown.appendChild(itemButton);
    });

    menuButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (menuButton.disabled) {
        return;
      }
      const isOpen = menuWrapper.classList.contains(SUBMISSION_MENU_OPEN_CLASS);
      if (!isOpen) {
        closeAllSubmissionMenus(menuWrapper);
      }
      const nextOpen = !isOpen;
      setSubmissionMenuState(menuWrapper, nextOpen);
    });

    menuDropdown.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    menuWrapper.appendChild(menuButton);
    menuWrapper.appendChild(menuDropdown);
    actions.appendChild(menuWrapper);

    const subRow = document.createElement("div");
    subRow.className = "hn-submission-sub";
    if (meta.childNodes.length) {
      subRow.appendChild(meta);
    }
    subRow.appendChild(actions);
    body.appendChild(subRow);

    item.appendChild(rank);
    item.appendChild(body);
    container.appendChild(item);
  });

  const moreLink = sourceTable.querySelector("a.morelink");
  if (moreLink) {
    const moreContainer = document.createElement("div");
    moreContainer.className = "hn-submissions-more";
    moreContainer.appendChild(moreLink.cloneNode(true));
    container.appendChild(moreContainer);
  }

  sourceTable.dataset[ZEN_HN_SUBMISSIONS_KEY] = "true";
  sourceTable.insertAdjacentElement("beforebegin", container);
  sourceTable.style.display = "none";
}

function restyleFatItem() {
  const fatitem = document.querySelector("table.fatitem");
  if (!fatitem || fatitem.dataset.zenHnRestyled === "true") {
    return;
  }

  const commentRow = getFatItemCommentRow(fatitem);
  if (commentRow) {
    const wrapper = document.createElement("div");
    wrapper.className = "hn-fatitem is-comment";
    const replyForm = fatitem.querySelector("form textarea[name='text']")?.closest("form");
    const replyResolved = resolveReplyFormFromElement(replyForm);
    const commentItem = buildCommentItem(commentRow, {
      indentLevel: 0,
      hasChildren: false,
      showOnStory: true,
      replyResolved,
    });
    if (!commentItem) {
      return;
    }
    wrapper.appendChild(commentItem);
    fatitem.dataset.zenHnRestyled = "true";
    fatitem.insertAdjacentElement("beforebegin", wrapper);
    fatitem.style.display = "none";
    return;
  }

  const titleLink = fatitem.querySelector(".titleline a")
    || fatitem.querySelector("a.storylink")
    || fatitem.querySelector("a.titlelink");
  if (!titleLink) {
    return;
  }

  const subtext = fatitem.querySelector(".subtext");
  const toptext = fatitem.querySelector(".toptext");
  const hnuser = subtext?.querySelector(".hnuser");
  const score = subtext?.querySelector(".score");
  const age = subtext?.querySelector(".age");
  const sitebit = fatitem.querySelector(".titleline .sitebit");
  const commentsLink = subtext
    ? Array.from(subtext.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase() || "";
        return text.includes("comment") || text.includes("discuss");
      })
    : null;

  const itemId = new URLSearchParams(window.location.search).get("id") || "";
  const storedStoryAction = getStoredAction("stories", itemId);
  const { isUpvoted } = getVoteState(fatitem);
  let isUpvotedState = isUpvoted;

  const wrapper = document.createElement("div");
  wrapper.className = "hn-fatitem";

  const title = titleLink.cloneNode(true);
  title.classList.add("hn-fatitem-title");
  wrapper.appendChild(title);

  const subRow = document.createElement("div");
  subRow.className = "hn-fatitem-sub";

  const meta = document.createElement("div");
  meta.className = "hn-fatitem-meta";

  const appendMetaItem = (node, className) => {
    if (!node) {
      return;
    }
    const clone = node.cloneNode(true);
    if (clone.classList?.contains("hnuser")) {
      clone.classList.remove("hnuser");
      clone.classList.add("hn-fatitem-user");
    }
    if (className) {
      clone.classList.add(className);
    }
    if (className === "hn-fatitem-site" || clone.classList.contains("sitebit")) {
      stripParenTextNodes(clone);
    }
    meta.appendChild(clone);
  };

  appendMetaItem(score);
  appendMetaItem(hnuser);
  appendMetaItem(age);
  appendMetaItem(commentsLink, "hn-fatitem-comments");
  appendMetaItem(sitebit, "hn-fatitem-site");

  const actions = document.createElement("div");
  actions.className = "hn-comment-actions hn-fatitem-actions";

  const upvoteLink = fatitem.querySelector("a[id^='up_']");
  const unvoteLink = fatitem.querySelector("a[id^='un_'], a[href*='how=un']");
  const upvoteHref = upvoteLink?.getAttribute("href") || "";
  const unvoteHref = unvoteLink?.getAttribute("href") || "";

  const hasVoteLinks = Boolean(upvoteLink || unvoteLink);
  const storedVote = storedStoryAction?.vote;
  const domUpvoted = isUpvoted || Boolean(unvoteLink);
  if (hasVoteLinks && itemId) {
    if (domUpvoted && storedVote !== "up") {
      updateStoredAction("stories", itemId, { vote: "up" });
    }
  }
  if (!domUpvoted && storedVote === "up") {
    isUpvotedState = true;
  } else if (domUpvoted) {
    isUpvotedState = true;
  }

  const upvoteButton = document.createElement("button");
  upvoteButton.className = "icon-button";
  upvoteButton.type = "button";
  upvoteButton.setAttribute("aria-label", "Upvote");
  upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
  upvoteButton.innerHTML = renderIcon("arrow-fat-up");
  if (isUpvotedState) {
    upvoteButton.classList.add("is-active");
  }
  if (upvoteLink || isUpvotedState) {
    upvoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const voteHref = isUpvotedState
        ? (unvoteHref || ZEN_LOGIC.buildVoteHref(upvoteHref, "un", window.location.href))
        : upvoteHref;
      if (!voteHref) {
        return;
      }
      fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
      isUpvotedState = !isUpvotedState;
      if (itemId) {
        updateStoredAction("stories", itemId, { vote: isUpvotedState ? "up" : null });
      }
      upvoteButton.classList.toggle("is-active", isUpvotedState);
      upvoteButton.setAttribute("aria-pressed", isUpvotedState ? "true" : "false");
    });
  } else {
    upvoteButton.hidden = true;
  }

  const favoriteLinkById = fatitem.querySelector(
    "a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']",
  );
  const favoriteLinkByText = subtext
    ? Array.from(subtext.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase();
        return text === "favorite" || text === "unfavorite";
      })
    : null;
  const favoriteLink = favoriteLinkById || favoriteLinkByText;
  const favoriteText = favoriteLink?.textContent?.trim().toLowerCase() || "";
  const storedFavorite = storedStoryAction?.favorite;
  const hasFavoriteSignal = Boolean(favoriteLink);
  const domFavorited = favoriteText === "unfavorite";
  let isFavorited = domFavorited || storedFavorite === true;
  // Only sync TO storage when DOM shows favorited but we don't have it stored
  if (hasFavoriteSignal && itemId && domFavorited && storedFavorite !== true) {
    updateStoredAction("stories", itemId, { favorite: true });
  }
  let favoriteHref = favoriteLink?.getAttribute("href") || "";

  const bookmarkButton = document.createElement("button");
  bookmarkButton.className = "icon-button";
  bookmarkButton.type = "button";
  bookmarkButton.setAttribute("aria-label", "Favorite");
  bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
  bookmarkButton.innerHTML = renderIcon("bookmark-simple");
  if (isFavorited) {
    bookmarkButton.classList.add("is-active");
  }
  bookmarkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wasFavorited = isFavorited;
    isFavorited = ZEN_LOGIC.toggleFavoriteState(isFavorited);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    if (itemId) {
      updateStoredAction("stories", itemId, { favorite: isFavorited });
    }
    if (!favoriteHref && itemId) {
      bookmarkButton.disabled = true;
      const resolved = await resolveStoryFavoriteLink(itemId);
      bookmarkButton.disabled = false;
      if (!resolved?.href) {
        isFavorited = wasFavorited;
        bookmarkButton.classList.toggle("is-active", isFavorited);
        bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
        if (itemId) {
          updateStoredAction("stories", itemId, { favorite: isFavorited });
        }
        return;
      }
      favoriteHref = resolved.href;
    }
    if (!favoriteHref) {
      isFavorited = wasFavorited;
      bookmarkButton.classList.toggle("is-active", isFavorited);
      bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
      if (itemId) {
        updateStoredAction("stories", itemId, { favorite: isFavorited });
      }
      return;
    }
    await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
    isFavorited = ZEN_LOGIC.willFavoriteFromHref(favoriteHref);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    if (itemId) {
      updateStoredAction("stories", itemId, { favorite: isFavorited });
    }
    favoriteHref = buildNextFavoriteHref(favoriteHref, !isFavorited);
  });

  const linkButton = document.createElement("button");
  linkButton.className = "icon-button";
  linkButton.type = "button";
  linkButton.setAttribute("aria-label", "Copy link");
  const linkIconSwap = document.createElement("span");
  linkIconSwap.className = "icon-swap";
  linkIconSwap.innerHTML = `
    <span class="icon-default">${renderIcon("link-simple")}</span>
    <span class="icon-success">${renderIcon("check-circle")}</span>
  `;
  linkButton.appendChild(linkIconSwap);
  let copyResetTimer = null;
  linkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const itemHref = ZEN_LOGIC.buildItemHref(itemId, window.location.href);
    const targetHref = itemHref || window.location.href;
    const copied = await copyTextToClipboard(targetHref);
    if (copied) {
      if (copyResetTimer) {
        window.clearTimeout(copyResetTimer);
      }
      linkButton.classList.add("is-copied");
      linkButton.classList.add("is-active");
      copyResetTimer = window.setTimeout(() => {
        linkButton.classList.remove("is-copied");
        linkButton.classList.remove("is-active");
        copyResetTimer = null;
      }, 1500);
    }
  });

  const replyButton = document.createElement("button");
  replyButton.className = "icon-button is-flipped";
  replyButton.type = "button";
  replyButton.setAttribute("aria-label", "Reply");
  replyButton.innerHTML = renderIcon("share-fat");
  const replyForm = document.querySelector("form textarea[name='text']")?.closest("form");
  const replyLink = document.querySelector("a[href^='reply?id='], a[href^='addcomment?id=']");
  const replyResolved = resolveReplyFormFromElement(replyForm);
  const hasReplyTarget = Boolean(replyResolved || replyLink);
  if (!hasReplyTarget) {
    replyButton.disabled = true;
  }

  actions.appendChild(upvoteButton);
  actions.appendChild(bookmarkButton);
  actions.appendChild(linkButton);
  actions.appendChild(replyButton);

  if (toptext) {
    const toptextClone = toptext.cloneNode(true);
    toptextClone.classList.add("hn-fatitem-toptext");
    wrapper.appendChild(toptextClone);
  }

  subRow.appendChild(meta);
  subRow.appendChild(actions);

  const replyContainer = document.createElement("div");
  replyContainer.className = "hn-reply is-hidden";
  const replyTextarea = document.createElement("textarea");
  replyTextarea.className = "hn-reply-textarea";
  replyTextarea.setAttribute("aria-label", "Reply");
  const closeReply = () => {
    replyContainer.classList.add("is-hidden");
  };
  replyTextarea.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    event.preventDefault();
    replySubmitButton.click();
  });
  const replySubmitButton = document.createElement("button");
  replySubmitButton.className = "hn-reply-button";
  replySubmitButton.type = "button";
  replySubmitButton.textContent = "Reply";
  const cancelButton = document.createElement("button");
  cancelButton.className = "hn-reply-cancel";
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeReply();
  });
  if (!hasReplyTarget) {
    replyTextarea.disabled = true;
    replySubmitButton.disabled = true;
    cancelButton.disabled = true;
  }
  replySubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const replyText = replyTextarea.value.trim();
    if (!replyText) {
      replyTextarea.focus();
      return;
    }
    replySubmitButton.disabled = true;
    replyTextarea.disabled = true;
    let result = { ok: false };
    try {
      if (replyResolved) {
        result = await submitReplyWithResolved(replyResolved, replyText);
      } else if (replyLink) {
        result = await submitReply(replyLink.getAttribute("href") || "", replyText);
      }
    } finally {
      replySubmitButton.disabled = false;
      replyTextarea.disabled = false;
    }
    if (result.ok) {
      replyTextarea.value = "";
      closeReply();
      return;
    }
  });
  const replyActions = document.createElement("div");
  replyActions.className = "hn-reply-actions";
  replyActions.appendChild(replySubmitButton);
  replyActions.appendChild(cancelButton);
  replyContainer.appendChild(replyTextarea);
  replyContainer.appendChild(replyActions);

  if (hasReplyTarget) {
    replyButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const isHidden = replyContainer.classList.toggle("is-hidden");
      if (!isHidden) {
        replyTextarea.focus();
      }
    });
  }

  wrapper.appendChild(subRow);
  wrapper.appendChild(replyContainer);

  fatitem.dataset.zenHnRestyled = "true";
  fatitem.insertAdjacentElement("beforebegin", wrapper);
  fatitem.style.display = "none";
}

function buildCommentItem(row, options = {}) {
  if (!row) {
    return null;
  }

  const {
    indentLevel: indentOverride,
    hasChildren: hasChildrenOverride,
    showOnStory = false,
    replyResolved = null,
    replyHref: replyHrefOverride,
  } = options;

  const cell = row.querySelector("td.default");
  if (!cell) {
    return null;
  }

  const user = row.querySelector(".comhead .hnuser")?.textContent?.trim() || "";
  const timestamp = row.querySelector(".comhead .age a")?.textContent?.trim() || "";
  const comhead = row.querySelector(".comhead");
  const textHtml = row.querySelector(".commtext")?.innerHTML || "";
  const upvoteLink = row.querySelector("a[id^='up_']");
  const downvoteLink = row.querySelector("a[id^='down_']");
  const unvoteLink = row.querySelector("a[id^='un_'], a[href*='how=un']");
  const upvoteHref = upvoteLink?.getAttribute("href") || "";
  const downvoteHref = downvoteLink?.getAttribute("href") || "";
  const unvoteHref = unvoteLink?.getAttribute("href") || "";
  const favoriteLinkById = row.querySelector(
    "a[id^='fav_'], a[id^='fave_'], a[href^='fave?id=']",
  );
  const favoriteLinkByText = comhead
    ? Array.from(comhead.querySelectorAll("a")).find((link) => {
        const text = link.textContent?.trim().toLowerCase();
        return text === "favorite" || text === "unfavorite";
      })
    : null;
  const favoriteLink = favoriteLinkById || favoriteLinkByText;
  const commentId = getCommentId(row, comhead);
  const replyHref = replyHrefOverride ?? getReplyHref(row, comhead);
  const storedCommentAction = getStoredAction("comments", commentId);
  let { isUpvoted, isDownvoted } = getVoteState(row);
  const hasVoteLinks = Boolean(upvoteLink || downvoteLink || unvoteLink);
  const storedVote = storedCommentAction?.vote;
  if (hasVoteLinks && commentId) {
    if (isUpvoted && storedVote !== "up") {
      updateStoredAction("comments", commentId, { vote: "up" });
    } else if (isDownvoted && storedVote !== "down") {
      updateStoredAction("comments", commentId, { vote: "down" });
    }
  }
  if (!isUpvoted && !isDownvoted && storedVote) {
    isUpvoted = storedVote === "up";
    isDownvoted = storedVote === "down";
  }
  const favoriteText = favoriteLink?.textContent?.trim().toLowerCase() || "";
  const storedFavorite = storedCommentAction?.favorite;
  const hasFavoriteSignal = Boolean(favoriteLink);
  const domFavorited = favoriteText === "unfavorite";
  let isFavorited = domFavorited || storedFavorite === true;
  // Only sync TO storage when DOM shows favorited but we don't have it stored
  if (hasFavoriteSignal && commentId && domFavorited && storedFavorite !== true) {
    updateStoredAction("comments", commentId, { favorite: true });
  }

  const indentLevel = Number.isFinite(indentOverride)
    ? indentOverride
    : getIndentLevelFromRow(row);
  const hasChildren = typeof hasChildrenOverride === "boolean"
    ? hasChildrenOverride
    : false;

  const item = document.createElement("div");
  item.className = "hn-comment";
  item.classList.add(`level-${indentLevel}`);
  item.style.setProperty("--indent-level", String(indentLevel));
  item.dataset.indentLevel = String(indentLevel);
  item.dataset.collapsed = "false";
  item.dataset.hasChildren = hasChildren ? "true" : "false";

  const header = document.createElement("div");
  header.className = "hn-comment-header";

  const collapseButton = document.createElement("button");
  collapseButton.className = "icon-button hn-collapse-button";
  collapseButton.type = "button";
  collapseButton.innerHTML = renderIcon("caret-down");
  setCollapseButtonState(collapseButton, false, hasChildren);
  collapseButton.addEventListener("click", (event) => {
    event.stopPropagation();
    toggleCommentCollapse(item);
  });

  const meta = document.createElement("div");
  meta.className = "hn-comment-meta";
  if (comhead) {
    meta.classList.add("has-comhead");
    const userLink = comhead.querySelector(".hnuser");
    if (userLink) {
      const userSpan = document.createElement("span");
      userSpan.className = "hn-comment-user";
      userSpan.appendChild(userLink.cloneNode(true));
      meta.appendChild(userSpan);
    }
    const ageSpan = comhead.querySelector(".age");
    if (ageSpan) {
      const age = document.createElement("span");
      age.className = "hn-comment-age";
      age.appendChild(ageSpan.cloneNode(true));
      meta.appendChild(age);
    }
    const scoreSpan = comhead.querySelector(".score");
    if (scoreSpan) {
      const score = document.createElement("span");
      score.className = "hn-comment-score";
      score.textContent = scoreSpan.textContent;
      meta.appendChild(score);
    }
    const onStoryLink = comhead.querySelector(".onstory a");
    if (onStoryLink) {
      const onStory = document.createElement("span");
      onStory.className = "hn-comment-onstory";
      onStory.appendChild(onStoryLink.cloneNode(true));
      meta.appendChild(onStory);
    }
  } else {
    meta.textContent = [user, timestamp].filter(Boolean).join(" • ");
  }

  const actions = document.createElement("div");
  actions.className = "hn-comment-actions";

  const upvoteButton = document.createElement("button");
  upvoteButton.className = "icon-button";
  upvoteButton.type = "button";
  upvoteButton.setAttribute("aria-label", "Upvote");
  upvoteButton.setAttribute("aria-pressed", isUpvoted ? "true" : "false");
  upvoteButton.innerHTML = renderIcon("arrow-fat-up");
  if (isUpvoted) {
    upvoteButton.classList.add("is-active");
  }
  if (upvoteLink || isUpvoted) {
    upvoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const voteHref = isUpvoted
        ? (unvoteHref || ZEN_LOGIC.buildVoteHref(upvoteHref, "un", window.location.href))
        : upvoteHref;
      if (!voteHref) {
        return;
      }
      fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
      const nextState = ZEN_LOGIC.toggleVoteState(
        { isUpvoted, isDownvoted },
        "up",
      );
      isUpvoted = nextState.isUpvoted;
      isDownvoted = nextState.isDownvoted;
      if (commentId) {
        updateStoredAction("comments", commentId, {
          vote: isUpvoted ? "up" : isDownvoted ? "down" : null,
        });
      }
      upvoteButton.classList.toggle("is-active", isUpvoted);
      upvoteButton.setAttribute("aria-pressed", isUpvoted ? "true" : "false");
      downvoteButton.classList.toggle("is-active", isDownvoted);
      downvoteButton.setAttribute("aria-pressed", isDownvoted ? "true" : "false");
    });
  } else {
    upvoteButton.hidden = true;
  }

  const downvoteButton = document.createElement("button");
  downvoteButton.className = "icon-button";
  downvoteButton.type = "button";
  downvoteButton.setAttribute("aria-label", "Downvote");
  downvoteButton.setAttribute("aria-pressed", isDownvoted ? "true" : "false");
  downvoteButton.innerHTML = renderIcon("arrow-fat-down");
  if (isDownvoted) {
    downvoteButton.classList.add("is-active");
  }
  if (downvoteLink || isDownvoted) {
    downvoteButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const voteHref = isDownvoted
        ? (unvoteHref || ZEN_LOGIC.buildVoteHref(downvoteHref, "un", window.location.href))
        : downvoteHref;
      if (!voteHref) {
        return;
      }
      fetch(voteHref, { credentials: "same-origin", cache: "no-store" });
      const nextState = ZEN_LOGIC.toggleVoteState(
        { isUpvoted, isDownvoted },
        "down",
      );
      isUpvoted = nextState.isUpvoted;
      isDownvoted = nextState.isDownvoted;
      if (commentId) {
        updateStoredAction("comments", commentId, {
          vote: isUpvoted ? "up" : isDownvoted ? "down" : null,
        });
      }
      downvoteButton.classList.toggle("is-active", isDownvoted);
      downvoteButton.setAttribute("aria-pressed", isDownvoted ? "true" : "false");
      upvoteButton.classList.toggle("is-active", isUpvoted);
      upvoteButton.setAttribute("aria-pressed", isUpvoted ? "true" : "false");
    });
  } else {
    downvoteButton.hidden = true;
  }

  const bookmarkButton = document.createElement("button");
  bookmarkButton.className = "icon-button";
  bookmarkButton.type = "button";
  bookmarkButton.setAttribute("aria-label", "Favorite");
  bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
  bookmarkButton.innerHTML = renderIcon("bookmark-simple");
  if (isFavorited) {
    bookmarkButton.classList.add("is-active");
  }
  bookmarkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const wasFavorited = isFavorited;
    isFavorited = ZEN_LOGIC.toggleFavoriteState(isFavorited);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    if (commentId) {
      updateStoredAction("comments", commentId, { favorite: isFavorited });
    }
    let favoriteHref = favoriteLink?.getAttribute("href") || "";
    if (!favoriteHref) {
      bookmarkButton.disabled = true;
      const resolved = await resolveFavoriteLink(commentId);
      bookmarkButton.disabled = false;
      if (!resolved?.href) {
        isFavorited = wasFavorited;
        bookmarkButton.classList.toggle("is-active", isFavorited);
        bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
        if (commentId) {
          updateStoredAction("comments", commentId, { favorite: isFavorited });
        }
        return;
      }
      favoriteHref = resolved.href;
    }
    await fetch(favoriteHref, { credentials: "same-origin", cache: "no-store" });
    isFavorited = ZEN_LOGIC.willFavoriteFromHref(favoriteHref);
    bookmarkButton.classList.toggle("is-active", isFavorited);
    bookmarkButton.setAttribute("aria-pressed", isFavorited ? "true" : "false");
    if (commentId) {
      updateStoredAction("comments", commentId, { favorite: isFavorited });
    }
  });

  const shareButton = document.createElement("button");
  shareButton.className = "icon-button is-flipped";
  shareButton.type = "button";
  shareButton.setAttribute("aria-label", "Reply");
  shareButton.innerHTML = renderIcon("share-fat");
  let replyContainer = null;
  shareButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (replyContainer) {
      const isHidden = replyContainer.classList.toggle("is-hidden");
      if (!isHidden) {
        replyContainer.querySelector("textarea")?.focus();
      }
    }
  });

  const linkButton = document.createElement("button");
  linkButton.className = "icon-button";
  linkButton.type = "button";
  linkButton.setAttribute("aria-label", "Copy link");
  const linkIconSwap = document.createElement("span");
  linkIconSwap.className = "icon-swap";
  linkIconSwap.innerHTML = `
    <span class="icon-default">${renderIcon("link-simple")}</span>
    <span class="icon-success">${renderIcon("check-circle")}</span>
  `;
  linkButton.appendChild(linkIconSwap);
  let copyResetTimer = null;
  linkButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const commentHref = ZEN_LOGIC.buildCommentHref(commentId, window.location.href);
    if (!commentHref) {
      return;
    }
    const copied = await copyTextToClipboard(commentHref);
    if (copied) {
      if (copyResetTimer) {
        window.clearTimeout(copyResetTimer);
      }
      linkButton.classList.add("is-copied");
      linkButton.classList.add("is-active");
      copyResetTimer = window.setTimeout(() => {
        linkButton.classList.remove("is-copied");
        linkButton.classList.remove("is-active");
        copyResetTimer = null;
      }, 1500);
    }
  });

  actions.appendChild(upvoteButton);
  actions.appendChild(downvoteButton);
  actions.appendChild(bookmarkButton);
  actions.appendChild(linkButton);
  actions.appendChild(shareButton);

  header.appendChild(collapseButton);
  header.appendChild(meta);
  header.appendChild(actions);

  const text = document.createElement("div");
  text.className = "hn-comment-text";
  text.innerHTML = textHtml;

  replyContainer = document.createElement("div");
  replyContainer.className = "hn-reply is-hidden";
  const replyTextarea = document.createElement("textarea");
  replyTextarea.className = "hn-reply-textarea";
  replyTextarea.setAttribute("aria-label", "Reply");
  const closeReply = () => {
    replyContainer.classList.add("is-hidden");
  };
  replyTextarea.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    event.preventDefault();
    replyButton.click();
  });
  const replyButton = document.createElement("button");
  replyButton.className = "hn-reply-button";
  replyButton.type = "button";
  replyButton.textContent = "Reply";
  const cancelButton = document.createElement("button");
  cancelButton.className = "hn-reply-cancel";
  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";
  cancelButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeReply();
  });
  const hasReplyTarget = Boolean(replyResolved || replyHref);
  if (!hasReplyTarget) {
    replyTextarea.disabled = true;
    replyButton.disabled = true;
    cancelButton.disabled = true;
  }
  replyButton.addEventListener("click", async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const replyText = replyTextarea.value.trim();
    if (!replyText) {
      replyTextarea.focus();
      return;
    }
    if (!hasReplyTarget) {
      return;
    }
    replyButton.disabled = true;
    replyTextarea.disabled = true;
    let result = { ok: false };
    try {
      if (replyResolved) {
        result = await submitReplyWithResolved(replyResolved, replyText);
      } else if (replyHref) {
        result = await submitReply(replyHref, replyText);
      }
    } finally {
      replyButton.disabled = false;
      replyTextarea.disabled = false;
    }
    if (result.ok) {
      replyTextarea.value = "";
      closeReply();
      return;
    }
  });
  const replyActions = document.createElement("div");
  replyActions.className = "hn-reply-actions";
  replyActions.appendChild(replyButton);
  replyActions.appendChild(cancelButton);
  replyContainer.appendChild(replyTextarea);
  replyContainer.appendChild(replyActions);

  item.appendChild(header);
  item.appendChild(text);
  item.appendChild(replyContainer);
  return item;
}

function restyleComments(context) {
  if (!context?.root) {
    return;
  }

  if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
    return;
  }

  const existingLists = document.querySelectorAll("#hn-comment-list");
  existingLists.forEach((list) => {
    const wrapperRow = list.closest("tr[data-zen-hn-comment-row='true']");
    if (wrapperRow) {
      wrapperRow.remove();
      return;
    }
    list.remove();
  });

  const container = document.createElement("div");
  container.id = "hn-comment-list";

  const rows = context.rows || getCommentRows(context.root);
  if (!rows.length) {
    if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "loading") {
      delete document.documentElement.dataset[ZEN_HN_RESTYLE_KEY];
    }
    return;
  }

  document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] = "true";
  rows.forEach((row, index) => {
    const indentLevel = getIndentLevelFromRow(row);
    const nextIndentLevel = getIndentLevelFromRow(rows[index + 1]);
    const hasChildren = nextIndentLevel > indentLevel;
    const item = buildCommentItem(row, { indentLevel, hasChildren });
    if (!item) {
      return;
    }
    container.appendChild(item);
  });

  const moreLink = context.root.querySelector("a.morelink");
  if (moreLink) {
    const moreContainer = document.createElement("div");
    moreContainer.className = "hn-comment-more";
    const moreAnchor = moreLink.cloneNode(true);
    moreContainer.appendChild(moreAnchor);
    container.appendChild(moreContainer);
  }

  if (context.mode === "rows") {
    const insertAfter = context.insertAfter?.closest("tr") || rows[0];
    if (!insertAfter) {
      return;
    }
    const containerRow = document.createElement("tr");
    containerRow.dataset.zenHnCommentRow = "true";
    const containerCell = document.createElement("td");
    const cellCount = insertAfter.children.length || 1;
    if (cellCount > 1) {
      containerCell.colSpan = cellCount;
    }
    containerCell.appendChild(container);
    containerRow.appendChild(containerCell);
    insertAfter.insertAdjacentElement("afterend", containerRow);

    const rowsToHide = new Set(rows);
    rows.forEach((row) => {
      const spacer = row.nextElementSibling;
      if (spacer?.classList.contains("spacer")) {
        rowsToHide.add(spacer);
      }
    });
    if (moreLink) {
      const moreRow = moreLink.closest("tr");
      if (moreRow) {
        rowsToHide.add(moreRow);
        const moreSpacer = moreRow.previousElementSibling;
        if (moreSpacer?.classList.contains("morespace")) {
          rowsToHide.add(moreSpacer);
        }
      }
    }
    rowsToHide.forEach((row) => {
      row.style.display = "none";
    });
    return;
  }

  context.root.insertAdjacentElement("afterend", container);
  context.root.style.display = "none";
}

function getCommentRows(table) {
  const rows = Array.from(table.querySelectorAll("tr.athing"));
  return rows.filter(
    (row) => row.classList.contains("comtr") || row.querySelector(".comment .commtext"),
  );
}

function getFatItemCommentRow(fatitem) {
  if (!fatitem) {
    return null;
  }
  const commentContent = fatitem.querySelector(".comment .commtext, .commtext");
  const rowFromContent = commentContent?.closest("tr");
  if (rowFromContent) {
    return rowFromContent;
  }
  return getCommentRows(fatitem)[0] || null;
}

function getStoryRows(root) {
  if (!root) {
    return [];
  }
  const rows = Array.from(root.querySelectorAll("tr.athing"));
  return rows.filter(
    (row) => !row.classList.contains("comtr") && !row.querySelector(".comment .commtext"),
  );
}

function findCommentContext() {
  const commentTree = document.querySelector("table.comment-tree");
  if (commentTree) {
    return { root: commentTree, mode: "table" };
  }

  const itemTables = Array.from(document.querySelectorAll("table.itemlist"));
  const itemTable = itemTables.find((table) => getCommentRows(table).length > 0);
  if (itemTable) {
    return { root: itemTable, mode: "table" };
  }

  const bigboxTable = document.querySelector("tr#bigbox table");
  if (bigboxTable && getCommentRows(bigboxTable).length > 0) {
    return { root: bigboxTable, mode: "table" };
  }

  const hnMain = document.querySelector("table#hnmain");
  if (!hnMain) {
    return null;
  }
  const rows = getCommentRows(hnMain);
  if (!rows.length) {
    return null;
  }
  const insertAfter = document.querySelector("tr#bigbox") || rows[0];
  return {
    root: hnMain,
    mode: "rows",
    rows,
    insertAfter,
  };
}

function runRestyleWhenReady() {
  let attempts = 0;
  const maxAttempts = 20;
  const attempt = () => {
    if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "true") {
      return;
    }
    const context = findCommentContext();
    if (!context) {
      attempts += 1;
      if (attempts >= maxAttempts) {
        if (document.documentElement.dataset[ZEN_HN_RESTYLE_KEY] === "loading") {
          delete document.documentElement.dataset[ZEN_HN_RESTYLE_KEY];
        }
        return;
      }
      window.requestAnimationFrame(attempt);
      return;
    }
    restyleComments(context);
  };
  attempt();
}

async function initRestyle() {
  await loadActionStore();
  buildSidebarNavigation();
  if (isUserProfilePage()) {
    document.documentElement.dataset.zenHnUserPage = "true";
  }
  restyleSubmissions();
  restyleFatItem();
  runRestyleWhenReady();
}

runSidebarWhenReady();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initRestyle();
  });
} else {
  initRestyle();
}
