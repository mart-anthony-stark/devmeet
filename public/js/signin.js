Vue.component('login', {
    data(){
      return{
        email: null,
        password: null,
        emailErr: null,
        passwordErr: null,
      }
    },
    methods:{
        changeComp(){
            this.$emit('change-component', 'signup')
        },
        async login(e){
            e.preventDefault()
            console.log('LOGIN', this.email)
            console.log('LOGIN', this.password)

            const res = await fetch('/auth/signin', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({email: this.email, password: this.password})
            })
            const data = await res.json()

            if(data.emailError) this.emailErr = data.emailError
            if(data.passwordError) this.passwordErr = data.passwordError

            if(data.redirectUrl) window.location = data.redirectUrl
            console.log(data)
        }
    },
    template: `<div>
                <form class="login" @submit="login">
                    <h2>login</h2>
                    <hr>
                    <div class="input-field">
                        <input id="email" type="text" name="email" v-model="email" required>
                        <label for="username">Email</label>
                    </div>
                    <p class="error">{{emailErr}}</p>
                    <div class="input-field">
                        <input id="password" type="password" name="password" v-model="password" required>
                        <label for="password">Password</label>
                    </div>
                    <p class="error">{{passwordErr}}</p>
                    <button class="btn-push"><span class="btn-front">signin</span></button>
                    <p>Doesn’t have an account? <span @click="changeComp" id="sign">Sign up<span></p>
                </form>
                </div>`
})
Vue.component('signup', {
    methods:{
        changeComp(){
            this.$emit('change-component', 'login')
        },
        login(e){
            e.preventDefault()
            console.log('LOGIN')
        }
    },
    template: `<div>
                <form class="login" @submit="login">
                    <h2>signup</h2>
                    <hr>
                    <div class="input-field">
                        <input id="username" type="text" name="username" required>
                        <label for="username">Username</label>
                    </div>
                    <div class="input-field">
                        <input id="email" type="text" name="email" required>
                        <label for="email">Email</label>
                    </div>
                    <div class="input-field">
                        <input id="password" type="password" name="password" required>
                        <label for="password">Password</label>
                    </div>
                    <button class="btn-push"><span class="btn-front">signup</span></button>
                    <p>Already have an account? <span @click="changeComp" id="sign">Login<span></p>
                </form>
                </div>`
})

new Vue({
    el: '#root',
    data(){
        return{
            component: 'login'
        }
    },
    methods:{
        changeComp(comp){
            this.component = comp
        }
    }
})