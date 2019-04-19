<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form style="float:right">
        <el-form-item>
          <!--<el-button type="primary" size="mini" icon="plus" v-if="hasPerm('role:add')" @click="showCreate">添加-->
          <!--</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <el-table :stripe="true" :data="list" v-loading.body="listLoading" element-loading-text="拼命加载中" border fit
              highlight-current-row>
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名" prop="username" ></el-table-column>
      <el-table-column align="center" label="昵称" prop="nickname" ></el-table-column>
      <el-table-column align="center" label="动作" prop="operation" ></el-table-column>
      <el-table-column align="center" label="API" prop="uri" ></el-table-column>
      <el-table-column align="center" label="参数" prop="params" ></el-table-column>
      <el-table-column align="center" label="IP" prop="ip" ></el-table-column>
      <el-table-column align="center" label="操作时间" >
        <template slot-scope="scope">
          {{parseTime(scope.row.createTime)}}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :total="totalCount"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form class="small-space" :model="tempRole" label-position="left" label-width="80px"
               style='width: 300px; margin-left:50px;'>
        <el-form-item label="角色名" required>
          <el-input type="text" v-model="tempRole.roleName">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" >
          <el-input type="textarea" v-model="tempRole.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="success" @click="createRole">创 建</el-button>
        <el-button type="primary" v-else @click="updateRole">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default {
    data() {
      return {
        totalCount: 0, //分页组件--数据总条数
        list: [],//表格的数据
        listLoading: false,//数据加载等待动画
        listQuery: {
          pageNum: 1,//页码
          pageSize: 10,//每页条数
        },
        roles: [],//角色列表
        dialogStatus: 'create',
        dialogFormVisible: false,
        textMap: {
          update: '编辑',
          create: '新建角色'
        },
        tempRole: {
          id: '',
          roleName: '',
          remark:''
        }
      }
    },
    created() {
      this.getList();
    },
    computed: {
    },
    methods: {
      getList() {
        //查询列表
        this.listLoading = true;
        this.api({
          url: "/system/log/list",
          method: "post",
          params: this.listQuery
        }).then(data => {
          this.listLoading = false;
          this.list = data.list;
          this.totalCount = data.total;
        })
      },
      handleSizeChange(val) {
        //改变每页数量
        this.listQuery.pageSize = val
        this.handleFilter();
      },
      handleCurrentChange(val) {
        //改变页码
        this.listQuery.pageNum = val
        this.getList();
      },
      handleFilter() {
        //查询事件
        this.listQuery.pageNum = 1
        this.getList()
      },
      getIndex($index) {
        //表格序号
        return (this.listQuery.pageNum - 1) * this.listQuery.pageSize + $index + 1
      },
      showCreate() {
        //显示新增对话框
        this.tempRole.roleName = "";
        this.tempRole.remark = "";
        this.tempRole.id= "";
        this.dialogStatus = "create";
        this.dialogFormVisible = true
      },
      showUpdate($index) {
        this.tempRole = this.list[$index];
        this.dialogStatus = "update";
        this.dialogFormVisible = true
      },
      createRole() {
        //添加新角色
        this.api({
          url: "/auth/role/add",
          method: "post",
          data: this.tempRole
        }).then(() => {
          this.getList();
          this.dialogFormVisible = false
        })
      },
      updateRole() {
        //修改角色信息
        let _vue = this;
        this.api({
          url: "/auth/role/update",
          method: "post",
          data: this.tempRole
        }).then(() => {
          this.dialogFormVisible = false
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1 * 1000,
            onClose: () => {
              _vue.getList();
            }
          })
        })
      },
    }
  }
</script>
