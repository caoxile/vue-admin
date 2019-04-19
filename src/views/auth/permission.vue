<template>
  <div class="app-container" >
    <zk-table
      ref="table"
      sum-text="sum"
      index-text="#"
      :data="dataList"
      :columns="columns"
      :stripe="props.stripe"
      :border="props.border"
      :show-header="props.showHeader"
      :show-summary="props.showSummary"
      :show-row-hover="props.showRowHover"
      :show-index="props.showIndex"
      :tree-type="props.treeType"
      :is-fold="props.isFold"
      :expand-type="props.expandType"
      :selection-type="props.selectionType">
      <template slot="operation" scope="scope" >
        <el-button size="mini" type="success" v-if="scope.row.parentId==0&&hasPerm('permission:add')" @click="showCreate(scope.row)">添加</el-button>
        <el-button size="mini" type="primary" v-if="hasPerm('permission:update')" @click="showUpdate(scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" v-if="scope.row.parentId!==0&&hasPerm('permission:delete')" @click="deletePermission(scope.row.id)">删除</el-button>
      </template>
    </zk-table>
    <!--新增弹框-->
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible" top="5%" width="45%" center>
      <el-form class="small-space" :model="record" :rules="recordRules"
               ref="recordForm" label-position="right" label-width="140px">
        <el-form-item label="权限名称" prop="permissionName" style="width: 400px">
          <el-input v-model="record.permissionName"></el-input>
        </el-form-item>

        <el-form-item label="权限标识" prop="permissionCode" style="width: 400px" >
          <el-input v-model="record.permissionCode"></el-input>
        </el-form-item>

        <el-form-item label="权限描述"  style="width: 600px" >
          <el-input type="textarea" :rows="3" v-model="record.remark"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRecord('recordForm')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dialogFormVisible:false,
        dialogTitle:'',
        record: {},
        recordRules: {
          permissionName: [
            {required: true, message: '请输入权限名称', trigger: 'blur'},
          ],
          permissionCode: [
            {required: true, message: '请输入权限路径', trigger: 'blur'},
          ],
        },
        props: {
          stripe: true,
          border: true,
          showHeader: true,
          showSummary: false,
          showRowHover: true,
          showIndex: false,
          treeType: true,
          isFold: false,
          expandType: false,
          selectionType: false,
        },
        dataList: [],
        columns: [
          {
            label: '权限名称',
            prop: 'permissionName',
            minWidth: '300px',
          },
          {
            label: '权限标志',
            prop: 'permissionCode',
          },
          {
            label: '权限描述',
            prop: 'remark',
          },
          {
            label: '操作',
            prop: 'operation',
//            minWidth: '100px',
            type:'template',
            template: 'operation'
          }
        ],
      };
    },
    computed: {
    },
    created() {
      this.findTreeData();
    },
    methods: {
      //权限列表
      findTreeData() {
        this.listLoading = true;
        this.api({
          url: "/auth/permission/tree",
          method: "post"
        }).then(data => {
          this.dataList = data;
          this.dialogFormVisible = false
        })
      },
      //新增
      showCreate(data){
        this.dialogTitle='新增权限';
        this.record={}
        this.dialogFormVisible=true;
        this.record.parentId=data.id
      },
      //编辑
      showUpdate(data){
        this.dialogTitle='编辑权限';
        this.record={
          permissionName:data.permissionName,
          permissionCode:data.permissionCode,
          remark:data.remark,
          id:data.id
        }
        this.dialogFormVisible=true
      },
      //删除
      deletePermission(id){
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.api({
            url: "/auth/permission/delete",
            method: "post",
            params:{id:id}
          }).then(data => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.findTreeData();
          })
        })
      },
      //新增/修改
      submitRecord(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if(this.dialogTitle==='新增权限'){
              this.api({
                url: "/auth/permission/add",
                method: "post",
                data:this.record
              }).then(() => {
                this.dialogFormVisible = false;
                this.record={}
                this.$message({
                  message: '新增成功',
                  type: 'success'
                });
                this.findTreeData();
              })
            }else{
              this.api({
                url: "/auth/permission/update",
                method: "post",
                data:this.record
              }).then(() => {
                this.dialogFormVisible = false;
                this.record={}
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.findTreeData();
              })
            }
          }
        })
      },
    },
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .switch-list {
    margin: 20px 0;
    list-style: none;
    overflow: hidden;
  }
  .switch-item {
    margin: 20px;
    float: left;
  }
</style>
