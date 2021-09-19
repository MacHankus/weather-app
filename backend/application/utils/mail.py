from smtplib import SMTP
import config
from contextlib import contextmanager
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict


class MailConfig:
    """Set basic config for smtp connection.

    Args:
        conf (dict): Dictionary with defined must have keys for connection and email sending.

    """

    def __init__(self, conf: Dict):
        self.host = conf['host']
        self.port = conf['port']
        self.user = conf['user']
        self.password = conf['password']
        self.addr = conf['addr']

class MailServer:
    mail_config: MailConfig

    def __init__(self, mail_config: MailConfig):
        self.mail_config = mail_config

    @contextmanager
    def connect(self):
        self.server = SMTP(self.mail_config.host, self.mail_config.port)
        self.server.ehlo()
        self.server.starttls()
        self.server.login(self.mail_config.user, self.mail_config.password)
        try:
            yield MailSender(self.server, self.mail_config.addr)
        finally:
            self.server.quit()


class MailSender:
    def __init__(self, server: SMTP, addr: str):
        self.server = server
        self.addr = addr

    @contextmanager
    def connect(self):
        with self.server.connect() as server:
            yield self

    def send_standard_msg(self, to_addr, msg):
        self.server.sendmail(self.addr,
                             to_addr, msg)

    def send_confirmation_key(self, key, to_addr):
        msg = MIMEMultipart()
        msg['Subject'] = "Welcome to weather-app!"
        text = f"""Welcome to Weather-app.

        Here it is your application confirmation code: {key}. 

        Use it to finish registration!

        """
        msg.attach(MIMEText(text, 'plain'))
        self.send_standard_msg(to_addr, msg.as_string())
