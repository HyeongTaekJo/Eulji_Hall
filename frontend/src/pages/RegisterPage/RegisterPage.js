import React from 'react'
import {useDispatch} from "react-redux";
import { useForm } from "react-hook-form";
import { registerUser } from '../../store/thunkFunctions';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; // 추가된 부분

const RegisterPage = () => {
  const { 
    register, 
    handleSubmit, //확인 버튼 눌렀을 때 실행되는 것
    formState : {errors}, //유효성 검사가 실패한 부분에 에러가 담긴다.
    reset // 모든 입력값 리셋
  } = useForm({mode: 'onChange'}) //위 함수들은 useForm에 있는 것들

  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const onSubmit = ({email, password, name, confirmPassword}) => {

    if(password !== confirmPassword) {
      toast.error("비밀번호와 비밀번호 확인은 같아야 합니다.");
      return 
    }
    
    let body = {
      email,
      password,
      name,
    }

    dispatch(registerUser(body))
      .then(() => {
        // 회원가입 성공 후 로그인 페이지로 이동
        navigate('/login');
      })
      .catch((error) => {
        // 실패 시 에러 처리 (선택 사항)
        toast.error('회원가입 실패. 다시 시도해 주세요.');
      });

    reset();
  }

  const userEmail = {
    required : '필수 필드입니다.',
  }

  const userName = {
    required : '필수 필드입니다.',
  }

  const userPassword = {
    required : '필수 필드입니다.',
    minLength : { value : 6, message : '6자 이상 입력하세요.'},
  }

  const confirmPassword = {
    required : '필수 필드입니다.',
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
           htmlFor='password'
        >Name</label>
        <input 
          type="text"
          id='name'
          {...register('name',userName)}
        />
        { //유효성 검사 후, 나타나는 부분
          errors?.name && //error안에 email이 있을 때
          <div>
            <span >
              {errors.name.message} 
            </span>
          </div>  
        }
        <label
           htmlFor='password'
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
        <label
           htmlFor='confirmPassword'
        >Confirm Password</label>
        <input 
          type="password"
          id='confirmPassword'
          {...register('confirmPassword',confirmPassword)}
        />
        { //유효성 검사 후, 나타나는 부분
          errors?.confirmPassword && //error안에 email이 있을 때
          <div>
            <span >
              {errors.confirmPassword.message} 
            </span>
          </div>  
        }
        
        <br/>
        <button type='submit'>
          회원 가입
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
