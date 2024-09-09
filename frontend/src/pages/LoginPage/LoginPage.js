import React from 'react'
import {useDispatch} from "react-redux";
import { useForm } from "react-hook-form";
import { loginUser } from '../../store/thunkFunctions';

const LoginPage = () => {
  const { 
    register, 
    handleSubmit, //확인 버튼 눌렀을 때 실행되는 것
    formState : {errors}, //유효성 검사가 실패한 부분에 에러가 담긴다.
    reset // 모든 입력값 리셋
  } = useForm({mode: 'onChange'}) //위 함수들은 useForm에 있는 것들


  const dispatch = useDispatch();

  const onSubmit = ({email, password}) => {

    let body = {
      email,
      password
    }

    dispatch(loginUser(body));
    reset();
  }

  const userEmail = {
    required : '필수 필드입니다.',
  }
  
  const userPassword = {
    required : '필수 필드입니다.',
    minLength : { value : 6, message : '6자 이상 입력하세요.'},
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center' , alignItems: 'center',
      width: '100%', height: '100vh'
    }}>
      <form style={{display: 'flex', flexDirection:'column'}}
        onSubmit={handleSubmit(onSubmit)}
      >
        <label
           htmlFor='email'
        >Email</label>
        <input 
          type='email' 
          id='email'
          {...register('email',userEmail)}
        />
         { //유효성 검사 후, 나타나는 부분
          errors?.email && //error안에 email이 있을 때
          <div>
            <span >
              {errors.email.message} 
            </span>
          </div>  
          }
        <label
           htmlFor='email'
        >Password</label>
        <input 
          type="password"
          id='password'
          {...register('password',userPassword)}
        />
        { //유효성 검사 후, 나타나는 부분
          errors?.password && //error안에 email이 있을 때
          <div>
            <span >
              {errors.password.message} 
            </span>
          </div>  
        }
        <br/>
        <button type='submit'>
          Login
        </button>
      </form>
    </div>
  )
}

export default LoginPage
