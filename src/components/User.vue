<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--Card卡片-->
    <el-card class="box-card">
      <!-- Dialog对话框 -->
      <!-- 添加用户开始 -->
      <el-dialog
        title="提示"
        @close="$refs.addUserRef.resetFields();"
        :visible.sync="addUserDialog"
        width="50%"
      >
        <!-- 带规则校验的form表单 -->
        <el-form
          :model="addUser"
          :rules="addUserRules"
          ref="addUserRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUser.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUser.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="tianjia()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加用户结束 -->
      <!-- 编辑用户信息的对话框 -->
      <el-dialog
        title="提示"
        @close="$refs.editUserRef.resetFields()"
        :visible.sync="editUserDialog"
        width="50%"
      >
        <el-form
          :model="editUser"
          :rules="editUserRules"
          ref="editUserRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editUser.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUser.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="editUser.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="xiugai()">确 定</el-button>
        </span>
      </el-dialog>

      <!--使用layout布局   gutter是删格布局，每一栏都左右各来一个padding值为20/2-->
      <el-row :gutter="20">
        <el-col :span="8">
          <!--关键字搜索-->
          <el-input
            placeholder="请输入搜索内容"
            clearable
            @clear="getUserList()"
            class="input-with-select"
            v-model="querycdt.query"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <!--添加用户按钮-->
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="userList" stripe border style="width: 100%">
        <!--序号从1开始，在组件库中-->
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="150"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <!--
            <slot row="每条记录信息的对象" column="每条记录的列的信息"></slot>
          -->
          <!-- <span slot-scope="info">{{info.row}}-{{info.row.username}}</span> -->
          <!-- { "id": 500, "role_name": "超级管理员", "username": "admin", "create_time": 1486720211, "mobile": "12345678", "email": "adsfad@qq.com", "mg_state": true } -->
          <!-- <span slot-scope="info">{{info.row.mg_state===true?'显示':'不显示'}}</span> -->
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="270">
          <!-- 所有的按钮都需要id -->
          <template slot-scope="info">
            <!-- 编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              @click="delUser(info.row.id)"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="querycdt.tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    // 定义手机号码的自定义校验
    var checkAge = (rule, value, callback) => {
      // 手机号码规则：11位，1开头，纯数字，第二位是356789
      var reg = /^1[356789]\d{9}$/
      if (!reg.test(value)) {
        return callback(new Error('手机号格式不正确'))
      }
      callback()
    }
    return {
      // 修改用户信息
      editUserDialog: false,
      editUser: {
        username: '',
        email: '',
        mobile: ''
      },
      editUserRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' }
        ]
      },
      // 添加用户form表单的规则验证
      addUserRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          { validator: checkAge, trigger: 'blur' }
        ]
      },
      // 添加用户的数据
      addUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 数据的条数
      userList: [],
      querycdt: {
        tot: 0, // 总记录条数
        query: '', // 搜索的关键字
        pagenum: 1, // 当前的页码
        pagesize: 3 // 每页数据的条数
      },
      addUserDialog: false
    }
  },
  methods: {
    // 点击编辑页中的确认按钮
    async xiugai() {
      const { data: dt } = await this.$http.put(
        'users/' + this.editUser.id,
        this.editUser
      )
      console.log(dt)
      if (dt.meta.status !== 200) {
        // 失败
        return this.$message.error(dt.meta.msg)
      }
      // 执行成功，提示信息，关闭对话框，数据刷新
      this.$message.success(dt.meta.msg)
      this.editUserDialog = false
      this.getUserList()
    },

    // 点击页面上的修改按钮，要弹出dialog对话框，并显示对应id的信息内容
    async showEditDialog(id) {
      // dialog对话框显示
      this.editUserDialog = true
      // 发送axios请求，将用户信息给了editUser用户
      const { data: dt } = await this.$http.get('users/' + id)
      console.log(dt)
      this.editUser = dt.data
    },
    // 点击删除按钮的事件处理
    delUser(id) {
      this.$confirm('确认要删除此记录吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: dt } = await this.$http.delete('users/' + id)
          console.log(dt)
          // 删除失败做的操作
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 删除成功做的操作
          this.$message.success(dt.meta.msg)
          if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          // 刷新数据
          this.getUserList()
        })
        .catch(() => {})
    },
    // 添加操作
    tianjia() {
      this.$refs.addUserRef.validate(async valid => {
        // 验证为真，则执行下边
        if (valid) {
          const { data: dt } = await this.$http.post('users', this.addUser)
          console.log(dt)
          // 判断添加不成功的
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }

          // 判断添加成成功的 提示信息，关闭对话框，数据刷新
          this.$message.success(dt.meta.msg)
          this.addUserDialog = false
          // if (this.querycdt.pagesize === 3) {
          //   this.querycdt.pagenum++
          // }
          this.querycdt.pagenum =
            parseInt(this.querycdt.tot / this.querycdt.pagesize) + 1
          console.log(this.querycdt.pagenum)
          this.getUserList()
        }
      })
    },
    async getUserList() {
      const { data: dt } = await this.$http.get('users', {
        params: this.querycdt
      })
      console.log(dt.data)
      // 将获得的总记录条数的数目赋予给tot
      this.querycdt.tot = dt.data.total
      this.userList = dt.data.users
    },
    handleSizeChange(arg) {
      // 变化后的条数
      this.querycdt.pagesize = arg
      this.getUserList()
    },
    handleCurrentChange(arg) {
      // 变化后的当前的页码
      this.querycdt.pagenum = arg
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
