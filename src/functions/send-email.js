import sgMail from "@sendgrid/mail";
import { text } from "body-parser";
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendMail = async (email, subject, text, html) => {
  console.log(email,subject,text,html)
 try{
  const msg = {
    html:html,
    text:text,
    subject:subject,
    to: email, // Change to your recipient
    from: process.env.APP_MAIL // Change to your verified sende

  }
  console.log(msg)
  await sgMail
    .send(msg)
  console.log("SENT")
 }catch(err){
   console.log(err)
 }finally{
   return
 }
}

export default sendMail