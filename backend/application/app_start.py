from app import app
import config
import argparse


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument(
        '--environment', help="Set environment for flask application. Default is 'dev'.", type=str,  default='dev'
    )
    parser.add_argument(
        '--debug', help="Sets the debug mode.", action="store_true"
    )
    args = parser.parse_args()

    cf = config.Config.config


    app.run(port=cf['app']['port'], debug=args.debug)

