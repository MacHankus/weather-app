import pytest
import re 

@pytest.mark.parametrize(
    'data, expected_json, expected_status_code, success_login_cookies_names',
    [
        pytest.param(
            {"username": "test_user", "password": "qwerty"},
            {"success": True, "message": "Succesfully authenticated.", "code":200},
            200,
            'all'
        ),
        pytest.param(
            {"username": "test_user", "password": "dfgsdfg"},
            {"success": False, "message": "Missing or invalid credentials.", "details":["Provide correct credentials."], "code":401},
            401,
            None
        ),
    ],
    indirect=['success_login_cookies_names']
)
def test_login(data, expected_json, expected_status_code, success_login_cookies_names, app_client):
    resp = app_client.post('/auth/login',json=data)
    j = resp.get_json()

    #check every key for same value
    #can't do j == expected becouse of additional 'stats' field included into response after successful request
    #so checking only concrete keys
    for key, val in expected_json.items():
        assert j[key] == val

    assert resp.status_code == expected_status_code
    
    #get names of all cookies and sort for later equality check
    cookies = resp.headers.getlist('Set-Cookie')
    cookies_names = sorted([x.split('=')[0] for x in cookies])
    expected_cookies_names = sorted(success_login_cookies_names)
    
    assert cookies_names == expected_cookies_names
