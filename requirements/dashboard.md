Dashboard page

- Make sure the logut out function is completed
- Make sure the personal setting page is linked to the settings page
- Make sure the name fields and the user goal is display correctly via JWT
- Make sure that my resume display all the job(model)->title related to the user ONLY
- When the user submits in the text area where the user input the JD, it should call the POST /jd endpoint, claude should create a promopt where it will grab all the current user infomation including name,role,field, goal from db and it will generated the resume, for the title ensure it used the company name if have + role
- in the resume(get all resume) section there should a download button which will click and download json
- If I however over the one of the resume (get all resume), it should display the full title

- Edges cases
- There will be cases that user put in random data, in this case just let user know it cannot create a resume
